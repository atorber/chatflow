import {
  Contact,
  log,
  Room,
  Message,
} from 'wechaty'
import { FileBox } from 'file-box'

import { v4 } from 'uuid'
import { GroupMasterStore } from './store.js'

function getEventsMsg (eventName: any, msg: any) {
  const events: any = {}
  events[eventName] = msg
  let payload: any = {
    reqId: v4(),
    method: 'thing.event.post',
    version: '1.0',
    timestamp: new Date().getTime(),
    events,
  }
  payload = JSON.stringify(payload)
  // log.info(eventName)
  // print(eventName, payload)
  return payload
}

export const onMessage = async (message:Message) => {
  log.info('message', message)

  const contact = message.talker()
  const text = message.text()
  const talker = message.talker()
  const listener = message.listener()
  const room: Room | undefined = message.room() || undefined
  // log.info('room',room)
  let roomInfo = {}
  let alias = ''
  let member: Contact | undefined
  log.info('text', text)
  log.info('message.talker()', talker)
  // log.info('message.talker().id', message.talker().id)

  let avatarUrl: any = ''

  try {
    const avatar = await contact.avatar()
    avatarUrl = avatar.toJSON()
  } catch (e) {
    console.error('转换头像错误', e)

  }

  const user = {
    wxid: contact.id,
    gender: contact.gender(),
    type: contact.type(),
    nickName: contact.name(),
    avatar: avatarUrl,
    city: contact.city(),
    province: contact.province(),
  }

  // log.info('room', room)

  try {
    if (room && room.id && room.owner()) {
      log.info('room有roomowner信息')
      let avatarRoom:any = ''
      try {
        avatarRoom = await (await room.avatar()).toJSON()
      } catch (e) {
        log.error('room.avatar()', e)
      }
      alias = await room.alias(message.talker()) || ''
      member = await room.member(contact.name()) || undefined
      const topic = await room.topic()
      const ownerid = room.owner()?.id || ''
      const announce = await room.announce()

      roomInfo = {
        ownerid,
        roomid: room.id,
        nick: topic,
        announce,
        avatar: avatarRoom,
        alias,
        // member: await room.member(contact.name())
        // qrcode: await room.qrCode()
      }
      // log.info('await room.memberAll()',await room.memberAll())

    } else {
      log.info('room没有roomowner信息')
      roomInfo = {
        roomid: '',
        nick: '',
      }
    }
  } catch (err) {
    log.error('获取群信息失败：', err)
  }

  let payload: any = {
    user,
    from: talker,
    to: listener,
    type: message.type(),
    // message,
    text,
    room: roomInfo,
    wxKey: GroupMasterStore.wxKey,
    // content: 'X' + message.text(),
    alias,
    member,
    create_time: new Date().getTime(),
  }
  // log.info(payload)
  payload = JSON.stringify(payload)
  // log.info('payload', payload)

  payload = JSON.parse(payload)

  // mqttclient.publish(eventPost, getEventsMsg('message', payload));

  const reqMsg = getEventsMsg('message', payload)

  if (/[车找|人找|时间|打球报名]/i.test(text) && !message.self()) {
    // getTime(payload)
    // pubMsg(reqMsg)
    GroupMasterStore.reqStore.push(reqMsg)
  } else if (!message.self()) {
    // pubMsg(reqMsg)
    GroupMasterStore.reqStore.push(reqMsg)
  }

  // 1. send Image

  if (/^ding$/i.test(message.text())) {
    const fileBox = FileBox.fromUrl('https://wechaty.github.io/wechaty/images/bot-qr-code.png')
    await message.say(fileBox)
  }

  if (/^活动结算$/i.test(message.text())) {
    // const fileBox = FileBox.fromUrl('https://upload-images.jianshu.io/upload_images/2399305-c0eadbb1ebfc3e64.jpeg')
    const fileBox = FileBox.fromUrl('https://upload-images.jianshu.io/upload_images/2399305-0a8cee3f56b3b7e6.png')
    await message.say(fileBox)
  }

  // if (/^群组大师$/i.test(message.text())) {
  //     // 封面图片为自定义外部图片（注意控制图片大小）
  //     const miniProgramPayload = {
  //         appid: "wx36027ed8c62f675e",
  //         description: "群组大师群管理工具",
  //         title: "活动报名自动化管理助手~",
  //         pagePath: "pages/start/relatedlist/index.html",
  //         thumbKey: undefined,
  //         thumbUrl: "http://mmbiz.qpic.cn/mmbiz_jpg/mLJaHznUd7O4HCW51IPGVarcVwAAAuofgAibUYIct2DBPERYIlibbuwthASJHPBfT9jpSJX4wfhGEBnqDvFHHQww/0", // 推荐在 200K 以内，比例 5：4，宽度不大于 1080px
  //         username: "gh_6c52e2baeb2d@app"
  //     };

  //     const miniProgram = new MiniProgram(miniProgramPayload);

  //     await message.say(miniProgram);
  // }

}
