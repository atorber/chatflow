/* eslint-disable sort-keys */
import { v4 } from 'uuid'
import moment from 'moment'

import { Message, types } from 'wechaty'
// import { FileBox } from 'file-box'

function getCurTime () {
  // timestamp是整数，否则要parseInt转换
  const timestamp = new Date().getTime()
  const timezone = 8 // 目标时区时间，东八区
  const offsetGMT = new Date().getTimezoneOffset() // 本地时间和格林威治的时间差，单位为分钟
  const time = timestamp + offsetGMT * 60 * 1000 + timezone * 60 * 60 * 1000
  return time
}

async function wechaty2chatdev (message:Message) {
  const curTime = getCurTime()
  const timeHms = moment(curTime).format('YYYY-MM-DD HH:mm:ss')

  let msg:any = {
    reqId: v4(),
    method: 'thing.event.post',
    version: '1.0',
    timestamp: curTime,
    events: {
    },
  }

  const talker = message.talker()

  let text = ''
  let messageType = ''
  let textBox:any = {}
  let file: any
  const msgId = message.id

  switch (message.type()) {
    // 文本消息
    case types.Message.Text:
      messageType = 'Text'
      text = message.text()
      break

      // 图片消息
    case types.Message.Image:
      messageType = 'Image'
      file = await message.toImage().artwork()
      break

      // 链接卡片消息
    case types.Message.Url:
      messageType = 'Url'
      textBox = await message.toUrlLink()
      text = JSON.stringify(JSON.parse(JSON.stringify(textBox)).payload)
      break

      // 小程序卡片消息
    case types.Message.MiniProgram:
      messageType = 'MiniProgram'
      textBox = await message.toMiniProgram()
      text = JSON.stringify(JSON.parse(JSON.stringify(textBox)).payload)
      /*
            miniProgram: 小程序卡片数据
            {
              appid: "wx363a...",
              description: "贝壳找房 - 真房源",
              title: "美国白宫，10室8厅9卫，99999刀/月",
              iconUrl: "http://mmbiz.qpic.cn/mmbiz_png/.../640?wx_fmt=png&wxfrom=200",
              pagePath: "pages/home/home.html...",
              shareId: "0_wx363afd5a1384b770_..._1615104758_0",
              thumbKey: "84db921169862291...",
              thumbUrl: "3051020100044a304802010002046296f57502033d14...",
              username: "gh_8a51...@app"
            }
           */
      break

      // 语音消息
    case types.Message.Audio:
      messageType = 'Audio'
      file = await message.toFileBox()
      break

      // 视频消息
    case types.Message.Video:
      messageType = 'Video'
      file = await message.toFileBox()
      break

      // 动图表情消息
    case types.Message.Emoticon:
      messageType = 'Emoticon'
      file = await message.toFileBox()
      break

      // 文件消息
    case types.Message.Attachment:
      messageType = 'Attachment'
      file = await message.toFileBox()
      break

    case types.Message.Contact:
      messageType = 'Contact'
      try {
        textBox = await message.toContact()
      } catch (err) {

      }
      text = '联系人卡片消息'
      break

      // 其他消息
    default:
      messageType = 'Unknown'
      text = '未知的消息类型'
      break
  }

  if (file) {
    text = file.name
  }

  // console.debug('textBox:', textBox)

  const room = message.room()
  const roomInfo:any = {}
  if (room && room.id) {
    roomInfo.id = room.id
    try {
      const roomAvatar = await room.avatar()
      // console.debug('群头像room.avatar()============')
      // console.debug(typeof roomAvatar)
      // console.debug(roomAvatar)
      // console.debug('END============')

      roomInfo.avatar = JSON.parse(JSON.stringify(roomAvatar)).url
    } catch (err) {
    //   console.debug('群头像捕获了错误============')
      // console.debug(typeof err)
      // console.debug(err)
      // console.debug('END============')
    }
    roomInfo.ownerId = room.owner()?.id || ''

    try {
      roomInfo.topic = await room.topic()
    } catch (err) {
      roomInfo.topic = room.id
    }
  }

  let memberAlias:any = ''
  try {
    memberAlias = await room?.alias(talker)
  } catch (err) {

  }

  let avatar:any = ''
  try {

    avatar = await talker.avatar()
    // console.debug('好友头像talker.avatar()============')
    // console.debug(avatar)
    // console.debug('END============')
    avatar = JSON.parse(JSON.stringify(avatar)).url

  } catch (err) {
    // console.debug('好友头像捕获了错误============')
    // console.debug(err)
    // console.debug('END============')
  }

  const content:any = {}
  content.messageType = messageType
  content.text = text
  content.raw = textBox.payload || textBox._payload || {}

  const _payload = {
    id: msgId,
    talker: {
      id: talker.id,
      gender: talker.gender() || '',
      name: talker.name() || '',
      alias: await talker.alias() || '',
      memberAlias,
      avatar,
    },
    room: roomInfo,
    content,
    timestamp: curTime,
    timeHms,
  }

  msg.events.message = _payload
  msg = JSON.stringify(msg)

  return msg

}

function propertyMessage (name:string, info:any) {
  let message:any = {
    reqId: v4(),
    method: 'thing.property.post',
    version: '1.0',
    timestamp: new Date().getTime(),
    properties: {
    },
  }
  message.properties[name] = info
  message = JSON.stringify(message)
  return message
}

function eventMessage (name:string, info:any) {
  let message:any = {
    reqId: v4(),
    method: 'thing.event.post',
    version: '1.0',
    timestamp: new Date().getTime(),
    events: {
    },
  }
  message.events[name] = info
  message = JSON.stringify(message)
  return message
}

export { wechaty2chatdev, propertyMessage, eventMessage }
export default wechaty2chatdev
