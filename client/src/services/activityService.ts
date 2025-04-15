/* eslint-disable sort-keys */
import { Room, Contact, Message, Wechaty, log } from 'wechaty'
import { v4 } from 'uuid'
import { formatTimestamp, getCurTime } from '../utils/utils.js'
import moment from 'moment'
import { ChatFlowCore } from '../api/base-config.js'
import {
  ServeGetStatistics,
  // ServeCreateStatistics,
} from '../api/statistic.js'
import { ServeCreateOrders } from '../api/order.js'
import {  DataTables } from '../db/tables.js'

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
  shortCode?: string;
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
  totalNum: number;
  update_time: number;
  create_time: number;
  utc_time: string;
  isBench: boolean;
  member: Contact;
  act_decs: string;
}

// 比较两个数组差异
function findArrayDifferences (vika: Activity[], db: Activity[]): { addArray: Activity[], removeArray: Activity[] } {
  const removeArray: Activity[] = []
  const addArray: Activity[] = []

  // Find elements in vika that are not in db
  for (const obj1 of vika) {
    if (!db.some(obj2 => obj2._id === obj1._id)) {
      addArray.push(obj1)
    }
  }

  // Find elements in db that are not in vika
  for (const obj2 of db) {
    if (!vika.some(obj1 => obj1._id === obj2._id)) {
      removeArray.push(obj2)
    }
  }

  return { addArray, removeArray }
}

// 服务类
export class ActivityChat {

  static activities: Activity[] = []
  static bot:Wechaty

  private constructor () {
  }

  // 初始化
  static async init () {
    await this.getStatistics()
    this.bot = ChatFlowCore.bot
    log.info('初始化 ActivityChat 成功...')
  }

  // 获取统计打卡，从云端获取活动列表更新本地活动列表
  static async getStatistics () {
    const statisticsRes = await ServeGetStatistics()

    // log.info('维格表中的统计：' + JSON.stringify(statisticsRes))
    const statisticsRecords = statisticsRes.data.items
    const activitiesVika: Activity[] = []

    for (const fields of statisticsRecords) {
      if (fields._id && fields.type && fields.desc && (fields.topic || fields.roomid)) {
        const activity: Activity = fields as Activity
        activity.active = activity.active === '开启'
        activity._id = String(activity._id)
        activity.shortCode = String(activity._id)
        activitiesVika.push(activity)
      }
    }

    ChatFlowCore.logger.info('维格表中的有效活动：' + JSON.stringify(activitiesVika))

    const activitiesDb = await this.getActivityList()
    ChatFlowCore.logger.info('DB中的活动：' + JSON.stringify(activitiesDb))

    const { addArray, removeArray } = findArrayDifferences(activitiesVika, activitiesDb)
    ChatFlowCore.logger.info('新增：' + JSON.stringify(addArray))
    ChatFlowCore.logger.info('移除：' + JSON.stringify(removeArray))

    for (const statistics of addArray) {
      try {
        await ActivityChat.addActivity(statistics)
      } catch (e) {
        ChatFlowCore.logger.error('写入活动失败：', e)
      }
    }

    for (const statistics of removeArray) {
      try {
        await this.removeAtivity(statistics._id)
      } catch (e) {
        log.error('删除活动失败：', e)
      }
    }

    for (const statistics of activitiesVika) {
      try {
        await this.updateAtivity(statistics._id, statistics)

      } catch (e) {
        log.error('更新活动失败：', e)
      }
    }

    log.info('更新活动：' + activitiesVika.length)

    return statisticsRecords
  }

  // 创建订单
  static async createOrder (message: Message) {
    const talker = message.talker()
    const room = message.room()

    const curTime = getCurTime()
    const timeHms = moment(curTime).format('YYYY-MM-DD HH:mm:ss')

    const records = [
      {
        fields: {
          serialNumber: curTime,
          code: '4',
          desc: '测试打卡',
          name: talker.name(),
          alias: await talker.alias() || '',
          wxid: talker.id,
          topic: await room?.topic() || '',
          createdAt: timeHms,
          info: '--',
        },
      },
    ]

    ChatFlowCore.logger.info('订单消息:' + records)

    try {
      const res = await ServeCreateOrders(records)
      return res
    } catch (err) {
      ChatFlowCore.logger.error('创建订单，vika写入接口失败：', err)
      return err
    }
  }

  static getHelpText () {
    const keywordsBase: Record<string, string> = {
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

    const keywordList = Object.entries(keywordsBase).map(([ key, value ]) => `${key}${value}`).join('\n')

    return `回复括号内指令即可完成操作：\n--------------------------------\n${keywordList}\n--------------------------------\n`
  }

  // 创建活动
  static async addActivity (activity: Activity): Promise<Activity | any> {
    try {
      const tables = DataTables.getTables()
      const activityData = tables?.activity
      await activityData.insert(activity)
      this.activities.push(activity)
      return activity
    } catch (e) {
      return e
    }
  }

  // 删除活动
  static async removeAtivity (activityId: string): Promise<any> {
    try {
      const tables = DataTables.getTables()
      const activityData = tables?.activity
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
  static async updateAtivity (activityId: string, data: Activity): Promise<any> {
    try {
      const tables = DataTables.getTables()
      const activityData = tables?.activity
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
  static async assignSubstituteParticipants (activity: Activity, additionalParticipants: number) {
    const canceledParticipants = additionalParticipants
    const newlyAssignedParticipants:any[] = []
    const tables = DataTables.getTables()
    const orderData = tables?.order
    const substituteOrders = await orderData.find({
      isBench: true,
      act_id: activity._id,
    })

    if (substituteOrders.length > 0) {
      let remainingAdditionalParticipants = canceledParticipants

      for (const substituteOrder of substituteOrders) {
        const member = await this.bot.Contact.find({ id: substituteOrder.wxid })

        if (member) {
          const participantsToAssign = Math.min(substituteOrder.totalNum, remainingAdditionalParticipants)

          await this.registerActivity(activity, member, participantsToAssign, false, substituteOrder.create_time)
          newlyAssignedParticipants.push(member.id)

          remainingAdditionalParticipants -= participantsToAssign

          if (remainingAdditionalParticipants === 0) {
            break
          }
        }
      }
    }

    return [ canceledParticipants, newlyAssignedParticipants ]
  }

  // 获取活动列表
  static async getActivityList (room?: Room) {
    let query: any = {}
    let activityList = []
    const tables = DataTables.getTables()
    const activityData = tables?.activity
    if (room) {
      query = [ {
        roomid: room.id,
        type: '活动报名',
        active: true,
      },
      {
        topic: await room.topic(),
        type: '活动报名',
        active: true,
      } ]

      activityList = await activityData.find({ $or: query })
    } else {
      query = {
        type: '活动报名',
        active: true,
      }
      activityList = await activityData.find(query)
    }

    // ChatFlowCore.logger.info('获取活动列表：======================\n' + JSON.stringify(activityList));
    return activityList
  };

  static async getActivityListText (room: Room) {
    const acts = await this.getActivityList(room)
    let msg: string = ''
    if (acts.length > 1) {
      const actsText = acts.map((act: Activity, index: number) => `【报名${index === 0 ? '' : act._id}】\n${act.desc}\n\n`).join('')
      msg = `有${acts.length}个报名中的活动，回复指令报名\n------------------------------\n${actsText}`
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
  static async getLatestActivity (room: Room, shortCode?: string) {
    const query: any = [ {
      roomid: room.id,
      type: '活动报名',
      active: true,
    },
    {
      topic: await room.topic(),
      type: '活动报名',
      active: true,
    } ]

    if (shortCode) {
      query.shortCode = shortCode
    }
    const tables = DataTables.getTables()
    const activityData = tables?.activity
    const latestActivity = await activityData.findOne({ $or:query })

    // ChatFlowCore.logger.info('获取最新活动：======================\n' + JSON.stringify(latestActivity));

    return latestActivity || {}
  };

  static async getLatestActivityText (room: Room, shortCode?: string) {
    let msg: string = ''
    const act = await ActivityChat.getLatestActivity(room, shortCode)
    if (act._id) {
      const orders = await this.getAllOrdersForActivity(act)
      msg = this.generateOrderText(act, orders, msg)
    } else {
      msg = `没有编号${shortCode}的活动或活动已截止`
    }

    return msg
  }

  // 获取指定活动全部订单
  static async getAllOrdersForActivity (activity: Activity) {
    const query = {
      act_id: activity._id,
    }
    const tables = DataTables.getTables()
    const orderData = tables?.order
    const orders = await orderData.find(query)
    return orders
  };

  // 获取活动报名人数
  static getActivityTotalParticipants (orders: Order[]) {
    let totalParticipants = 0
    for (const order of orders) {
      totalParticipants += order.totalNum
    }
    return totalParticipants
  };

  // 报名活动
  static async registerActivity (activity: Activity, member: Contact, additionalNumber: number, isBench: boolean, createTime: number) {
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
      totalNum: isBench ? 1 : additionalNumber,
      update_time: timestamp,
      create_time: createTime,
      act_decs: activity.desc,
      utc_time: formatTimestamp(timestamp)[5],
      isBench,
      member,
    }
    const tables = DataTables.getTables()
    const orderData = tables?.order
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
  static async signUpForActivity (activity: Activity, member: Contact, additionalNumber: any, createTime: number) {
    activity.maximum = activity.maximum || 999
    const currentUserOrders: Order[] = await this.getCurrentUserOrdersForActivity(activity, member)
    let currentTotalNumber: any = 0
    let message = ''

    if (currentUserOrders.length) {
      for (const order of currentUserOrders) {
        currentTotalNumber += order.totalNum
      }
    }

    const singleUpperLimit = 999
    if (currentTotalNumber + additionalNumber > singleUpperLimit) {
      message = `@${member.name()} 名额超限，本活动限制每人累计最多报名 ${singleUpperLimit} 人`
    } else {
      const totalParticipants = await this.getActivityTotalParticipants(currentUserOrders)

      if (activity.maximum && totalParticipants >= activity.maximum) { // 报名已满
        await ActivityChat.registerActivity(activity, member, additionalNumber, true, createTime)
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

  static async signUpForActivityText (room: Room, member: Contact, additionalNumber: any, createTime: number, shortCode?: string) {
    let msg = ''
    if (additionalNumber < 3) {
      const act = await this.getLatestActivity(room, shortCode)
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
  static async cancelForActivity (act: Activity, curOrders: Order[], addNum: number, member: Contact) {
    let cancelNumTotal = 0
    let newAddNumAll = addNum
    let cancelNum: number = 0
    const newAdder:any = []
    const tables = DataTables.getTables()
    const orderData = tables?.order
    if (curOrders.length) {
      for (const order of curOrders) {
        const curOrder = order
        const { _id, totalNum, isBench } = curOrder

        if (isBench) {
          if (totalNum <= newAddNumAll) {
            await orderData.remove({ _id })

            newAddNumAll -= totalNum
            cancelNumTotal += totalNum

            if (newAddNumAll === 0) break
          } else {
            await orderData.update({ _id }, { $set: { totalNum: totalNum - addNum } }, { multi: true })
            cancelNumTotal += addNum
            newAddNumAll = 0
            break
          }
        } else {
          if (totalNum > newAddNumAll) {
            await orderData.update({ _id }, { $set: { totalNum: totalNum - newAddNumAll } }, { multi: true })
            cancelNumTotal += newAddNumAll
            cancelNum = newAddNumAll
          } else {
            await orderData.remove({ _id })
            cancelNumTotal += totalNum
            cancelNum = totalNum
          }
        }
      }
    }

    if (cancelNum) {
      const benchs = await orderData.find({ isBench: true, act_id: act._id })
      // Do something with benchs

      if (benchs.length > 0) {
        let newAddNum = cancelNum

        for (const key in benchs) {
          if (benchs[key].totalNum <= newAddNum) {

            await ActivityChat.registerActivity(act, member, benchs[key].totalNum, false, benchs[key].create_time)
            newAdder.push(member.id)
            await orderData.remove({ _id: benchs[key]._id })

            newAddNum = newAddNum - benchs[key].totalNum

            if (newAddNum === 0) {
              break
            }

          } else {

            await ActivityChat.registerActivity(act, member, newAddNum, false, benchs[key].create_time)
            newAdder.push(member.id)

            break
          }

        }
      }
    }
    // Do something with the result
    return [ cancelNum, newAdder, cancelNumTotal ]
  }

  static async cancelForActivityText (room: Room, addNum: number, member: Contact, shortCode?: string) {
    let msg = ''

    const act: Activity = await this.getLatestActivity(room, shortCode)

    if (!act._id) {
      msg = `@${member.name()} 没有可取消报名的活动或活动已截止`
    } else {
      const curOrders = await this.getCurrentUserOrdersForActivity(act, member)

      if (curOrders.length > 0 && addNum === 1) {

        const cancelNum: any = await ActivityChat.cancelForActivity(act, curOrders, addNum, member)

        // 获取全部订单
        const orders = await this.getAllOrdersForActivity(act)

        if (cancelNum[1].length) {
          msg = `@${member.name()} 取消${cancelNum[2]}人成功,替补转正!\n------------------------------\n`
          msg = this.generateOrderText(act, orders, msg)
        } else {
          msg = `@${member.name()} 取消${cancelNum[2]}人成功!\n------------------------------\n`
          msg = this.generateOrderText(act, orders, msg)
        }

      } else if (curOrders.length > 0 && addNum !== 1) {
        msg = `@${member.name()} 一次只能取消一个已报名额`
      } else {
        msg = `@${member.name()} 未报名活动`
      }
    }

    return msg
  }

  // 更新报名信息
  static async updateSignInOrder (currentOrder: Order, additionalParticipants: any) {
    const tables = DataTables.getTables()
    const orderData = tables?.order
    return await orderData.update({ _id: currentOrder._id }, {
      $set: {
        totalNum: currentOrder.totalNum + additionalParticipants,
      },
    }, { multi: true })
  }

  // 获取当前用户订单
  static async getCurrentOrderForMember (activity: Activity, member: Contact) {
    const query: any = [ {
      act_id: activity._id,
      wxid: member.id,
    }, {
      act_id: activity._id,
      nick: member.name(),
    } ]
    const alias = await member.alias()
    if (alias) {
      query.push({
        act_id: activity._id,
        alias,
      })
    }
    const tables = DataTables.getTables()
    const orderData = tables?.order
    const order = await orderData.findOne({ $or:query })
    return order || {}
  }

  // 获取活动订单
  static async getCurrentUserOrdersForActivity (activity: Activity, member: Contact) {
    const query: any = [ {
      act_id: activity._id,
      wxid: member.id,
    }, {
      act_id: activity._id,
      nick: member.name(),
    } ]
    const alias = await member.alias()
    if (alias) {
      query.push({
        act_id: activity._id,
        alias,
      })
    }
    const tables = DataTables.getTables()
    const orderData = tables?.order
    const orders = await orderData.find({ $or: query })

    ChatFlowCore.logger.info('用户的订单：' + JSON.stringify(orders))

    return orders
  };

  // 活动报名信息拼接
  static generateOrderText (activity: Activity, orders: Order[], message: string) {
    const newOrders:any = []
    activity.maximum = activity.maximum || 999
    for (const order of orders) {
      if (order.totalNum === 0 || order.totalNum === 1) {
        newOrders.push(order)
      } else {
        for (let j = 0; j < order.totalNum; j++) {
          const newOrder = JSON.parse(JSON.stringify(order))

          if (newOrder.isBench) {
            newOrder.alias = newOrder.alias || newOrder.nick
          } else {
            newOrder.alias = j === 0 ? (newOrder.alias || newOrder.nick) : `${newOrder.alias || newOrder.nick}+${j}`
          }
          newOrders.push(newOrder)
        }
      }
    }

    orders = newOrders

    if (activity.shortCode) {
      activity.desc = `编号：${activity.shortCode}\n${activity.desc}\n`
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
