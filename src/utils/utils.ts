/* eslint-disable sort-keys */
import moment from 'moment'

import type {
  Contact,
  Room,
  // ScanStatus,
  // WechatyBuilder,
} from 'wechaty'

async function formatSentMessage (userSelf: Contact, text: string, talker: Contact|undefined, room: Room|undefined) {
  // console.debug('发送的消息：', text)
  const curTime = new Date().getTime()
  const timeHms = moment(curTime).format('YYYY-MM-DD HH:mm:ss')
  const record = {
    fields: {
      timeHms,
      name: userSelf.name(),
      topic: room ? (await room.topic() || '--') : (talker?.name() || '--'),
      messagePayload: text,
      wxid: room && talker ? (talker.id !== 'null' ? talker.id : '--') : userSelf.id,
      roomid: room ? (room.id || '--') : (talker?.id || '--'),
      messageType: 'selfSent',
    },
  }
  return record
}

// 定义一个延时方法
const waitForMs = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

function getNow () {
  return new Date().toLocaleString()
}

export {
  getNow,
  waitForMs,
  formatSentMessage,
}

export default waitForMs
