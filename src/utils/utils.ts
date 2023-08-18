/* eslint-disable sort-keys */
import moment from 'moment'

import type {
  Contact,
  Room,
  // ScanStatus,
  // WechatyBuilder,
} from 'wechaty'

import type { TaskConfig } from '../plugins/mod.js'

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

const getRule = (task:TaskConfig) => {
  const curTimeF = new Date(task.time)
  // const curTimeF = new Date(task.time+8*60*60*1000)
  let curRule = '* * * * * *'
  let dayOfWeek: any = '*'
  let month: any = '*'
  let dayOfMonth: any = '*'
  let hour: any = curTimeF.getHours()
  let minute: any = curTimeF.getMinutes()
  const second = 0
  const addMonth = []
  switch (task.cycle) {
    case '每季度':
      month = curTimeF.getMonth()
      for (let i = 0; i < 4; i++) {
        if (month + 3 <= 11) {
          addMonth.push(month)
        } else {
          addMonth.push(month - 9)
        }
        month = month + 3
      }
      month = addMonth
      break
    case '每天':
      break
    case '每周':
      dayOfWeek = curTimeF.getDay()
      break
    case '每月':
      month = curTimeF.getMonth()
      break
    case '每小时':
      hour = '*'
      break
    case '每30分钟':
      hour = '*'
      minute = [ 0, 30 ]
      break
    case '每15分钟':
      hour = '*'
      minute = [ 0, 15, 30, 45 ]
      break
    case '每10分钟':
      hour = '*'
      minute = [ 0, 10, 20, 30, 40, 50 ]
      break
    case '每5分钟':
      hour = '*'
      minute = [ 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55 ]
      break
    case '每分钟':
      hour = '*'
      minute = '*'
      break
    default:
      month = curTimeF.getMonth()
      dayOfMonth = curTimeF.getDate()
      break

  }
  curRule = `${second} ${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`
  return curRule
}

export {
  getNow,
  waitForMs,
  formatSentMessage,
  getRule,
}

export default waitForMs
