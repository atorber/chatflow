import {
  Message,
  log,
} from 'wechaty'

import { db } from '../db/tables.js'
const messageData = db.message

export const addMessage = async (message: Message) => {
  const talker = message.talker()
  const listener = message.listener()
  const room = message.room()
  let roomJson:any
  if (room) {
    roomJson = JSON.parse(JSON.stringify(room))
    delete roomJson.payload.memberIdList
  }

  const messageNew = {
    _id: message.id,
    data: message,
    listener:listener ?? undefined,
    room:roomJson,
    talker,
  }
  // log.info('addMessage messageNew:', JSON.stringify(messageNew))
  try {
    await messageData.insert(messageNew)
    // log.info('消息写入数据库成功:', res._id)
    return true
  } catch (e) {
    log.error('消息写入数据库失败:\n', e)
    return false
  }

}
