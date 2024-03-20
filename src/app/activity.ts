import { Message, log, Room } from 'wechaty'
import { containsRoom } from '../services/userService.js'
import { ChatFlowCore } from '../api/base-config.js'
import { ActivityChat } from '../services/activityService.js'

// 控制器
const activityController = async (message: Message, room: Room) => {

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
    msg = ActivityChat.getHelpText()
  }

  if (text.replace(/\s*/g, '') === '活动') {
    msg = await ActivityChat.getActivityListText(room)
  }

  if (matchActivityCode) { // 查询指定编号的活动
    const shortCode = matchActivityCode[0].substring(2)
    msg = await ActivityChat.getLatestActivityText(room, shortCode)
  }

  if ([ '报名', '报名活动' ].includes(text.replace(/\s*/g, '')) || /^报名\d人/g.test(text.replace(/\s*/g, ''))) { // 报名活动
    const trimmedContent = text.replace(/\s*/g, '')
    const addNum = trimmedContent === '报名' || trimmedContent === '报名活动' ? 1 : Number(trimmedContent.slice(2, 3))
    msg = await ActivityChat.signUpForActivityText(room, member, addNum, createdTime)
  }

  if (/^报名\d/g.test(text.replace(/\s*/g, ''))) { // 报名指定编号的活动
    const addNum = 1
    const shortCode = text.replace(/\s*/g, '').slice(2, 1000000)
    msg = await ActivityChat.signUpForActivityText(room, member, addNum, createdTime, shortCode)
  }

  if ([ '取消', '取消报名' ].includes(text.replace(/\s*/g, '')) || /^取消\d人/g.test(text.replace(/\s*/g, ''))) { // 取消活动报名
    // 取消报名
    let addNum = 0
    if ([ '取消', '取消报名' ].includes(text.replace(/\s*/g, ''))) {
      addNum = 1
    } else {
      addNum = Number(text.replace(/\s*/g, '').slice(2, 3))
    }
    msg = await ActivityChat.cancelForActivityText(room, addNum, member)
  }

  if (/^取消\d/g.test(text.replace(/\s*/g, ''))) { // 取消指定活动报名
    const addNum = 1
    const shortCode = text.replace(/\s*/g, '').slice(2, 1000000)
    msg = await ActivityChat.cancelForActivityText(room, addNum, member, shortCode)
  }

  // req = generateResponseMessage('Text', msg, roomid, wxid)
  // ChatFlowCore.logger.info('req===========================' + JSON.stringify(req))

  if (msg) {
    // ChatFlowCore.logger.info('活动操作结果：\n' + msg)
    await message.say(msg)
  }
}

export const handleActivityManagement = async (message: Message, room:Room) => {
  try {
    const topic = await room.topic()
    const isActInRoomWhiteList = await containsRoom(ChatFlowCore.whiteList.roomWhiteList.act, room)
    if (isActInRoomWhiteList) {
      log.info('当前群在act白名单内，开始请求活动管理...')
      try {
        await activityController(message, room)
      } catch (e) {
        log.error('活动管理失败', topic, e)
      }
    }
  } catch (e) {
    log.error('handleActivityManagement error', e)
  }
}
