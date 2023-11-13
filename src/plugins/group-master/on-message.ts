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
  let roomInfo = {}
  let alias = ''
  let member: Contact | undefined
  log.info('text', text)
  log.info('message.talker()', talker)
  // log.info('message.talker().id', message.talker().id)
  const room: Room | undefined = message.room() || undefined
  // log.info('room',room)

  const avatar = await contact.avatar()
  let avatarUrl: any = ''

  try {
    avatarUrl = avatar.toJSON()
  } catch (e) {
    console.error('头像', avatar)
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
    // log.info('@me', await message.mentionSelf())
    // log.info('message.text()', message.text())
    // log.info('talker', contact)
    // log.info('wxid', contact.id)
    // log.info('gender', contact.gender())
    // log.info('type', contact.type())
    // log.info('name', contact.name())
    // log.info('avatar', await contact.avatar())
    // log.info('alias', await contact.alias())
    // log.info('city', contact.city())
    // log.info('friend', contact.friend())
    // log.info('province', contact.province())
    // log.info('roomid', room.id)
    // log.info('room.topic()', await room.topic())
    if (room && room.id && room.owner()) {
      log.info('room', '有roomowner信息')
      try {
        alias = await room.alias(message.talker()) || ''
        member = await room.member(contact.name()) || undefined
        const ownerid = room.owner()?.id || ''
        roomInfo = {
          ownerid,
          roomid: room.id,
          nick: await room.topic(),
          announce: await room.announce(),
          avatar: await (await room.avatar()).toJSON(),
          alias: await room.alias(message.talker()) || '',
          // member: await room.member(contact.name())
          // qrcode: await room.qrCode()
        }
        // log.info('await room.memberAll()',await room.memberAll())
      } catch {
        roomInfo = {
          ownerid: room.owner()?.id || '',
          roomid: room.id,
          nick: await room.topic(),
          announce: await room.announce(),
          alias: await room.alias(message.talker()) || '',
          // member: await room.member(contact.name())
          // qrcode: await room.qrCode()
        }
        // log.info('await room.memberAll()',await room.memberAll())
      }

    } else {
      log.info('room', '没有roomowner信息')
      roomInfo = {
        roomid: '',
        nick: (await room?.topic()) || '',
      }
    }
  } catch (err) {
    console.error(err)
  }

  let payload: any = {
    user,
    from: message.talker(),
    to: message.to(),
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
  log.info('payload', payload)

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
  } else {
    log.info('self message .......')
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
