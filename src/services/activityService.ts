import { db } from '../db/tables.js'
import { Room, Contact, Message, Wechaty, log } from 'wechaty'
import { v4 } from 'uuid'
import { formatTimestamp } from '../utils/utils.js'

const activityData = db.activity
const orderData = db.order

// 活动接口
export interface Activity {
  _id: string;
  type: '活动报名' | '签到打卡' | '统计表' | '顺风车';
  desc: string;
  active: boolean | string,
  startTime?: number;
  duration?: number;
  maximum?: number;
  location?: string;
  cycle?: string;
  topic?: string;
  roomid?: string;
  short_code?: string;
  title: string;
}

export interface Order {
  _id: string;
  actualNumber: number;
  act_id: string;
  wxid: string;
  nick: string;
  alias?: string;
  status: number;
  total_num: number;
  update_time: number;
  create_time: number;
  utc_time: string;
  is_bench: boolean;
  member: Contact;
  act_decs: string;
}

// 服务类
export class ActivityService {

  private activities: Activity[] = []
  private activitiesStore: any = {}

  constructor() {

  }

  getHelpText() {
    const keywords_base: Record<string, string> = {
      '【报名】': '报名活动1人',
      '【取消】': '取消报名1人',
      '【报名51】': '报名编号51的活动',
      '【取消51】': '取消报名编号51的活动',
      '【活动】': '查询活动列表',
      '【启用】': '启用机器人（仅群主）',
      '【关闭】': '关闭机器人（仅群主）',
      // '【绑定】': '会员信息同步到小程序'
      // '<签到>': '活动签到',
      // '#加入': '加入俱乐部',
      // '#活动结束': '结束当前活动',
      // '#报名开启': '恢复活动报名',
      // '#活动模板': '获取发布活动模板',
    }

    const keywordList = Object.entries(keywords_base).map(([key, value]) => `${key}${value}`).join('\n')

    return `回复括号内指令即可完成操作：\n--------------------------------\n${keywordList}\n--------------------------------\n`
  }

  // 创建活动
  async addActivity(activity: Activity): Promise<Activity | any> {
    try {
      await activityData.insert(activity)
      this.activities.push(activity)
      return activity
    } catch (e) {
      return e
    }
  }

  // 删除活动
  async removeAtivity(activityId: string): Promise<any> {
    try {
      await activityData.remove({ _id: activityId })
      const indexToRemove = this.activities.findIndex(activity => activity._id === activityId)
      if (indexToRemove !== -1) {
        this.activities.splice(indexToRemove, 1)
      }
      return true
    } catch (e) {
      return e
    }
  }

  // 更新活动
  async updateAtivity(activityId: string, data: Activity): Promise<any> {
    try {
      await activityData.update({ _id: activityId }, data)
      const indexToUpdate = this.activities.findIndex(activity => activity._id === activityId)
      if (indexToUpdate !== -1) {
        this.activities[indexToUpdate] = data
      }
      return true
    } catch (e) {
      return e
    }
  }

  // 增加名额替补转正
  async assignSubstituteParticipants(activity: Activity, additionalParticipants: number, createTime: number, bot: Wechaty) {
    const canceledParticipants = additionalParticipants
    const newlyAssignedParticipants = []

    const substituteOrders = await orderData.find({
      is_bench: true,
      act_id: activity._id,
    })

    if (substituteOrders.length > 0) {
      let remainingAdditionalParticipants = canceledParticipants

      for (const substituteOrder of substituteOrders) {
        const member = await bot.Contact.find({ id: substituteOrder.wxid })

        if (member) {
          const participantsToAssign = Math.min(substituteOrder.total_num, remainingAdditionalParticipants)

          await this.registerActivity(activity, member, participantsToAssign, false, substituteOrder.create_time)
          newlyAssignedParticipants.push(member.id)

          remainingAdditionalParticipants -= participantsToAssign

          if (remainingAdditionalParticipants === 0) {
            break
          }
        }
      }
    }

    return [canceledParticipants, newlyAssignedParticipants]
  }

  // 获取活动列表
  async getActivityList(room?: Room) {
    let query: any = {}
    let activityList = []
    if (room) {
      query = [{
        roomid: room.id,
        type: '活动报名',
        active: true,
      },
      {
        topic: await room.topic(),
        type: '活动报名',
        active: true,
      }]
      activityList = await activityData.find({ $or: query })
    } else {
      query = {
        type: '活动报名',
        active: true,
      }
      activityList = await activityData.find(query)
    }

    // log.info('获取活动列表：======================\n', JSON.stringify(activityList));
    return activityList
  };

  async getActivityListText(room: Room) {
    const acts = await this.getActivityList(room)
    let msg: string = ''
    if (acts.length > 1) {
      const acts_text = acts.map((act: Activity, index: number) => `【报名${index === 0 ? '' : act._id}】\n${act.desc}\n\n`).join('')
      msg = `有${acts.length}个报名中的活动，回复指令报名\n------------------------------\n${acts_text}`
    } else if (acts.length === 1) {
      const act = acts[0]
      const orders = await this.getAllOrdersForActivity(act)
      msg = this.generateOrderText(act, orders, msg)
    } else {
      msg = '没有可报名的活动'
    }
    return msg
  }

  // 获取群组最新或指定活动信息
  async getLatestActivity(room: Room, short_code?: string) {
    const query: any = [{
      roomid: room.id,
      type: '活动报名',
      active: true,
    },
    {
      topic: await room.topic(),
      type: '活动报名',
      active: true,
    }]

    if (short_code) {
      query.short_code = short_code
    }

    const latestActivity = await activityData.findOne({$or:query})

    // log.info('获取最新活动：======================\n', JSON.stringify(latestActivity));

    return latestActivity || {}
  };

  async getLatestActivityText(room: Room, short_code?: string) {
    let msg: string = ''
    const act = await this.getLatestActivity(room, short_code)
    if (act._id) {
      const orders = await this.getAllOrdersForActivity(act)
      msg = this.generateOrderText(act, orders, msg)
    } else {
      msg = `没有编号${short_code}的活动或活动已截止`
    }

    return msg
  }

  // 获取指定活动全部订单
  async getAllOrdersForActivity(activity: Activity) {
    const query = {
      act_id: activity._id,
    }
    const orders = await orderData.find(query)
    return orders
  };

  // 获取活动报名人数
  getActivityTotalParticipants(orders: Order[]) {
    let totalParticipants = 0
    for (const order of orders) {
      totalParticipants += order.total_num
    }
    return totalParticipants
  };

  // 报名活动
  async registerActivity(activity: Activity, member: Contact, additionalNumber: number, isBench: boolean, createTime: number) {
    const timestamp = new Date().getTime()
    const orderId = v4()

    const data: Order = {
      _id: orderId,
      actualNumber: isBench ? 1 : additionalNumber,
      act_id: activity._id,
      wxid: member.id,
      nick: member.name(),
      alias: await member.alias(),
      status: 0,
      total_num: isBench ? 1 : additionalNumber,
      update_time: timestamp,
      create_time: createTime,
      act_decs: activity.desc,
      utc_time: formatTimestamp(timestamp)[5],
      is_bench: isBench,
      member,
    }

    if (isBench) {
      return await orderData.insert(data)
    } else {
      const oldOrder = await this.getCurrentOrderForMember(activity, member)
      if (oldOrder._id) {
        return await this.updateSignInOrder(oldOrder, additionalNumber)
      } else {
        return await orderData.insert(data)
      }
    }
  };

  // 报名活动或替补
  async signUpForActivity(activity: Activity, member: Contact, additionalNumber: any, createTime: number) {
    activity.maximum = activity.maximum || 999
    const currentUserOrders: Order[] = await this.getCurrentUserOrdersForActivity(activity, member)
    let currentTotalNumber: any = 0
    let message = ''

    if (currentUserOrders.length) {
      for (const order of currentUserOrders) {
        currentTotalNumber += order.total_num
      }
    }

    const singleUpperLimit = 999
    if (currentTotalNumber + additionalNumber > singleUpperLimit) {
      message = `@${member.name()} 名额超限，本活动限制每人累计最多报名 ${singleUpperLimit} 人`
    } else {
      const totalParticipants = await this.getActivityTotalParticipants(currentUserOrders)

      if (activity.maximum && totalParticipants >= activity.maximum) { // 报名已满
        await this.registerActivity(activity, member, additionalNumber, true, createTime)
        const orders = await this.getAllOrdersForActivity(activity)
        message = `@${member.name()} 【替补报名】${additionalNumber} 人成功!\n------------------------------\n`
        message = this.generateOrderText(activity, orders, message)
      } else { // 名额充足
        let benchNumber = 0
        if (totalParticipants + additionalNumber > activity.maximum) { // 判断报名是否超出最大可报人数
          benchNumber = totalParticipants + additionalNumber - activity.maximum
          await this.registerActivity(activity, member, benchNumber, true, createTime)
          additionalNumber = activity.maximum - totalParticipants
        } else {
          await this.registerActivity(activity, member, additionalNumber, false, createTime)
        }
        const orders = await this.getAllOrdersForActivity(activity)
        if (benchNumber > 0) {
          message = `@${member.name()} 报名 ${additionalNumber} 人, 替补 ${benchNumber} 人成功!\n------------------------------\n`
        } else {
          message = `@${member.name()} 报名 ${additionalNumber} 人成功!\n------------------------------\n`
        }
        message = this.generateOrderText(activity, orders, message)
      }
    }

    return message
  };

  async signUpForActivityText(room: Room, member: Contact, additionalNumber: any, createTime: number, short_code?: string) {
    let msg = ''
    if (additionalNumber < 3) {
      const act = await this.getLatestActivity(room, short_code)
      if (!act._id) {
        msg = `@${member.name()} 没有可报名的活动`
      } else {
        msg = await this.signUpForActivity(act, member, additionalNumber, createTime)
      }
    } else {
      msg = `@${member.name()} 名额超限，一次回复最多报2人，可多次回复`
    }
    return msg
  }

  // 取消报名或替补，替补转正
  async cancelForActivity(act: Activity, cur_orders: Order[], add_num: number, member: Contact) {
    let cancel_num_total = 0
    let new_add_num_all = add_num
    let cancel_num: number = 0
    const new_adder = []

    if (cur_orders.length) {
      for (const order of cur_orders) {
        const cur_order = order
        const { _id, total_num, is_bench } = cur_order

        if (is_bench) {
          if (total_num <= new_add_num_all) {
            await orderData.remove({ _id })

            new_add_num_all -= total_num
            cancel_num_total += total_num

            if (new_add_num_all === 0) break
          } else {
            await orderData.update({ _id }, { $set: { total_num: total_num - add_num } }, { multi: true })
            cancel_num_total += add_num
            new_add_num_all = 0
            break
          }
        } else {
          if (total_num > new_add_num_all) {
            await orderData.update({ _id }, { $set: { total_num: total_num - new_add_num_all } }, { multi: true })
            cancel_num_total += new_add_num_all
            cancel_num = new_add_num_all
          } else {
            await orderData.remove({ _id })
            cancel_num_total += total_num
            cancel_num = total_num
          }
        }
      }
    }

    if (cancel_num) {
      const benchs = await orderData.find({ is_bench: true, act_id: act._id })
      // Do something with benchs

      if (benchs.length > 0) {
        let new_add_num = cancel_num

        for (const key in benchs) {

          if (member) {
            if (benchs[key].total_num <= new_add_num) {

              await this.registerActivity(act, member, benchs[key].total_num, false, benchs[key].create_time)
              new_adder.push(member.id)
              await orderData.remove({ _id: benchs[key]._id })

              new_add_num = new_add_num - benchs[key].total_num

              if (new_add_num === 0) {
                break
              }

            } else {

              await this.registerActivity(act, member, new_add_num, false, benchs[key].create_time)
              new_adder.push(member.id)

              break
            }
          }

        }
      }
    }
    // Do something with the result
    return [cancel_num, new_adder, cancel_num_total]
  }

  async cancelForActivityText(room: Room, add_num: number, member: Contact, short_code?: string) {
    let msg = ''

    const act: Activity = await this.getLatestActivity(room, short_code)

    if (!act._id) {
      msg = `@${member.name()} 没有可取消报名的活动或活动已截止`
    } else {
      const cur_orders = await this.getCurrentUserOrdersForActivity(act, member)

      if (cur_orders.length > 0 && add_num === 1) {

        const cancel_num: any = await this.cancelForActivity(act, cur_orders, add_num, member)

        // 获取全部订单
        const orders = await this.getAllOrdersForActivity(act)

        if (cancel_num[1].length) {
          msg = `@${member.name()} 取消${cancel_num[2]}人成功,替补转正!\n------------------------------\n`
          msg = this.generateOrderText(act, orders, msg)
        } else {
          msg = `@${member.name()} 取消${cancel_num[2]}人成功!\n------------------------------\n`
          msg = this.generateOrderText(act, orders, msg)
        }

      } else if (cur_orders.length > 0 && add_num != 1) {
        msg = `@${member.name()} 一次只能取消一个已报名额`
      } else {
        msg = `@${member.name()} 未报名活动`
      }
    }

    return msg
  }

  // 更新报名信息
  async updateSignInOrder(currentOrder: Order, additionalParticipants: any) {
    return await orderData.update({ _id: currentOrder._id }, {
      $set: {
        total_num: currentOrder.total_num + additionalParticipants,
      },
    }, { multi: true })
  }

  // 获取当前用户订单
  async getCurrentOrderForMember(activity: Activity, member: Contact) {
    const query: any = [{
      act_id: activity._id,
      wxid: member.id,
    }, {
      act_id: activity._id,
      nick: member.name(),
    }]
    const alias = await member.alias()
    if (alias) {
      query.push({
        act_id: activity._id,
        alias
      })
    }
    const order = await orderData.findOne({$or:query})
    return order || {}
  }

  // 获取活动订单
  async getCurrentUserOrdersForActivity(activity: Activity, member: Contact) {
    const query: any = [{
      act_id: activity._id,
      wxid: member.id,
    }, {
      act_id: activity._id,
      nick: member.name(),
    }]
    const alias = await member.alias()
    if (alias) {
      query.push({
        act_id: activity._id,
        alias
      })
    }

    const orders = await orderData.find({ $or: query })

    log.info('用户的订单：', JSON.stringify(orders))

    return orders
  };

  // 活动报名信息拼接
  generateOrderText(activity: Activity, orders: Order[], message: string) {
    const newOrders = []
    activity.maximum = activity.maximum || 999
    for (const order of orders) {
      if (order.total_num === 0 || order.total_num === 1) {
        newOrders.push(order)
      } else {
        for (let j = 0; j < order.total_num; j++) {
          const newOrder = JSON.parse(JSON.stringify(order))

          if (newOrder.is_bench) {
            newOrder.alias = newOrder.alias || newOrder.nick
          } else {
            newOrder.alias = j === 0 ? (newOrder.alias || newOrder.nick) : `${newOrder.alias || newOrder.nick}+${j}`
          }
          newOrders.push(newOrder)
        }
      }
    }

    orders = newOrders

    if (activity.short_code) {
      activity.desc = `编号：${activity.short_code}\n${activity.desc}\n`
    }

    message = message + activity.desc + '\n已报' + (orders.length <= (activity.maximum || 999) ? orders.length : activity.maximum) + '/' + activity.maximum + '人\n'
    for (let i = 0; i < orders.length; i++) {
      const currentOrder = orders[i]
      let nickName = currentOrder?.alias || currentOrder?.nick
      nickName = String(i + 1) + '.' + nickName
      if (i < (activity.maximum - 1)) {
        message = message + nickName + '\n'
      } else if (i === (activity.maximum - 1)) {
        message = message + nickName + '\n' + '报名已满！\n'
      } else if (i === activity.maximum) {
        message = message + '\n替补报名' + (orders.length - activity.maximum) + '人\n' + nickName + '\n'
      } else {
        message = message + nickName + '\n'
      }
    }

    message += '\n\n'

    return message
  }

}

// 生成响应消息
export const generateResponseMessage = (msgType: string, msg: string, roomid: string, wxid: string | number | any[] | undefined) => {
  const timestamp = new Date().getTime()

  const commonParams = {
    reqId: '442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43',
    method: 'thing.command.invoke',
    version: '1.0',
    timestamp,
    name: 'pubMessage',
    params: {
      wxid,
      msg,
      roomid,
      msgType,
    },
  }

  if (msgType === 'Image' || msgType === 'Text' || msgType === 'Contact' || msgType === 'MiniProgram') {
    return commonParams
  } else if (msgType === 'UrlLink') {
    return {
      ...commonParams,
      timestamp: 1610430718000,
    }
  } else {
    return {
      reqId: '442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43',
      method: 'thing.command.invoke',
      version: '1.0',
      timestamp: 1610430718000,
      name: 'pubMessage',
      params: {
        code: 200,
        msg: 'success',
        data: '',
      },
    }
  }
}

// 云函数入口函数
export const activityController = async (message: Message, room: Room) => {
  const activityService = new ActivityService()

  const text = message.text()
  const createdTime = new Date().getTime()
  const member = message.talker()
  const isSelf = message.self()

  let msg = ''

  const pattern = /已报(\d+)\/\d+人/g
  const matches = text.match(pattern)
  const matchActivityCode = /^活动\d+/g.exec(text.replace(/\s*/g, ''))

  if (matches && !isSelf) { // 复制粘贴报名无效提示
    msg = '复制粘贴无效！！！请直接在群内回复【报名】或 【报名2人】'
  }

  if (text.replace(/\s*/g, '') === '活动帮助') { // 帮助信息
    msg = activityService.getHelpText()
  }

  if (text.replace(/\s*/g, '') === '活动') {
    msg = await activityService.getActivityListText(room)
  }

  if (matchActivityCode) { // 查询指定编号的活动
    const short_code = matchActivityCode[0].substring(2)
    msg = await activityService.getLatestActivityText(room, short_code)
  }

  if (['报名', '报名活动'].includes(text.replace(/\s*/g, '')) || /^报名\d人/g.test(text.replace(/\s*/g, ''))) { // 报名活动
    const trimmedContent = text.replace(/\s*/g, '')
    const add_num = trimmedContent === '报名' || trimmedContent === '报名活动' ? 1 : Number(trimmedContent.slice(2, 3))
    msg = await activityService.signUpForActivityText(room, member, add_num, createdTime)
  }

  if (/^报名\d/g.test(text.replace(/\s*/g, ''))) { // 报名指定编号的活动
    const add_num = 1
    const short_code = text.replace(/\s*/g, '').slice(2, 1000000)
    msg = await activityService.signUpForActivityText(room, member, add_num, createdTime, short_code)
  }

  if (['取消', '取消报名'].includes(text.replace(/\s*/g, '')) || /^取消\d人/g.test(text.replace(/\s*/g, ''))) { // 取消活动报名
    // 取消报名
    let add_num = 0
    if (['取消', '取消报名'].includes(text.replace(/\s*/g, ''))) {
      add_num = 1
    } else {
      add_num = Number(text.replace(/\s*/g, '').slice(2, 3))
    }
    msg = await activityService.cancelForActivityText(room, add_num, member)
  }

  if (/^取消\d/g.test(text.replace(/\s*/g, ''))) { // 取消指定活动报名
    const add_num = 1
    const short_code = text.replace(/\s*/g, '').slice(2, 1000000)
    msg = await activityService.cancelForActivityText(room, add_num, member, short_code)
  }

  // req = generateResponseMessage('Text', msg, roomid, wxid)
  // log.info('req===========================', JSON.stringify(req))

  if (msg) {
    // log.info('活动操作结果：\n', msg)
    await message.say(msg)
  }
}
