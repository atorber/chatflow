/* eslint-disable sort-keys */
import {
  Room,
  Contact,
  Message,
  Wechaty,
  WechatyBuilder,
} from 'wechaty'
import 'dotenv/config.js'

import { logger } from '../utils/mod.js'

import { FileBox } from 'file-box'
import mqtt from 'mqtt'
import axios from 'axios'
import { aide } from '../plugins/langchain.js'

const token = process.env['WECHATY_TOKEN']
const wxKey = process.env['WX_KEY']
const productKey = process.env['PRODUCT_KEY']
const instanceId = process.env['INSTANCE_ID']
const password = process.env['PASS_WORD']

const bot = WechatyBuilder.build({
  name: 'wxtool',
  puppet: 'wechaty-puppet-padlocal',
  puppetOptions: {
    token,
  },
})

const extractAtContent = (keyword: string, message: string): string | null => {
  const startTag = '「'
  const endTag = '」\n'

  // 判断信息中是否包含关键字
  if (message.trim().endsWith(`${keyword}`)) {
    logger.info('包含关键字：', keyword)
    const startIndex = message.indexOf(startTag) + startTag.length
    const endIndex = message.indexOf(endTag, startIndex)

    // 提取「和 」之间的内容
    if (startIndex !== -1 && endIndex !== -1) {
      const newText = message.substring(startIndex, endIndex)
      logger.info('提取到的内容：', newText)
      return newText
    } else {
      logger.info('未提取到内容：', message)
    }
  } else {
    logger.info('不包含关键字：', keyword)
  }

  return null
}

const username = `${instanceId}/${wxKey}`
const clientId = `${instanceId}-${productKey}-${wxKey}` + new Date().getTime()
// const eventPost = `thing/${productKey}/${wxKey}/event/post`
const commandInvoke = `thing/${productKey}/${wxKey}/command/invoke`

const msgStore:any = {}
const reqStore:any = []
const timerId:any = setInterval(() => {
  // logger.info('待处理消息池长度：', reqStore.length||0);
  if (reqStore.length) {
    logger.info('待处理消息池长度：', reqStore.length || 0)
    const req = reqStore.splice(0, 1)
    try {
      pubMsg(req)
        .catch(e => {
          logger.error('e', e)
        })
    } catch (err) {
      console.error('调用API服务失败：', err)
    }
  }
}, 50)

function print (msg: any, res: any) {
  console.info(new Date().toLocaleString() + ':' + msg + '\n')
  console.info(res)
}

function guid () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

async function sendAt (bot: Wechaty, params: any) {
  /*   {
    "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
    "method":"thing.command.invoke",
    "version":"1.0",
    "timestamp":1610430718000,
    "name":"sendAt",
    "params":{
        "room":"5550027590@chatroom",
        "toContacts":[
            "tyutluyc"
        ],
        "messagePayload":"welcome to wechaty!"
    }
} */

  const atUserIdList = params.toContacts
  const room = await bot.Room.find({ id: params.room })
  if (room) {
    const atUserList: Contact[] = []
    for (const userId of atUserIdList) {
      const curContact = await bot.Contact.find({ id: userId })
      if (curContact) {
        atUserList.push(curContact)
      }
    }
    await room.say(params.messagePayload, ...atUserList)
  }
}

async function send (bot: Wechaty, params: any) {
  logger.info(typeof (params))
  logger.info(params)

  let msg: any = ''
  if (params.messageType === 'Text') {
    /* {
  "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
  "method":"thing.command.invoke",
  "version":"1.0",
  "timestamp":1610430718000,
  "name":"send",
  "params":{
      "toContacts":[
          "tyutluyc",
          "5550027590@chatroom"
      ],
      "messageType":"Text",
      "messagePayload":"welcome to wechaty!"
  }
} */
    msg = params.messagePayload

  } else if (params.messageType === 'Contact') {
    /* {
      "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
      "method":"thing.command.invoke",
      "version":"1.0",
      "timestamp":1610430718000,
      "name":"send",
      "params":{
          "toContacts":[
              "tyutluyc",
              "5550027590@chatroom"
          ],
          "messageType":"Contact",
          "messagePayload":"tyutluyc"
      }
  } */
    const contactCard = await bot.Contact.find({ id: params.messagePayload })
    if (!contactCard) {
      logger.info('not found')
      return {
        msg: '无此联系人',
      }
    } else {
      msg = contactCard
    }

  } else if (params.messageType === 'Attachment') {
    /* {
    "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
    "method":"thing.command.invoke",
    "version":"1.0",
    "timestamp":1610430718000,
    "name":"send",
    "params":{
        "toContacts":[
            "tyutluyc",
            "5550027590@chatroom"
        ],
        "messageType":"Attachment",
        "messagePayload":"/tmp/text.txt"
    }
} */
    if (params.messagePayload.indexOf('http') !== -1 || params.messagePayload.indexOf('https') !== -1) {
      msg = FileBox.fromUrl(params.messagePayload)
    } else {
      msg = FileBox.fromFile(params.messagePayload)
    }

  } else if (params.messageType === 'Image') {
    /* {
    "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
    "method":"thing.command.invoke",
    "version":"1.0",
    "timestamp":1610430718000,
    "name":"send",
    "params":{
        "toContacts":[
            "tyutluyc",
            "5550027590@chatroom"
        ],
        "messageType":"Image",
        "messagePayload":"https://wechaty.github.io/wechaty/images/bot-qr-code.png"
    }
} */
    // msg = FileBox.fromUrl(params.messagePayload)
    if (params.messagePayload.indexOf('http') !== -1 || params.messagePayload.indexOf('https') !== -1) {
      msg = FileBox.fromUrl(params.messagePayload)
    } else {
      msg = FileBox.fromFile(params.messagePayload)
    }

  } else if (params.messageType === 'Url') {
    /* {
    "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
    "method":"thing.command.invoke",
    "version":"1.0",
    "timestamp":1610430718000,
    "name":"send",
    "params":{
        "toContacts":[
            "tyutluyc",
            "5550027590@chatroom"
        ],
        "messageType":"Url",
        "messagePayload":{
            "description":"WeChat Bot SDK for Individual Account, Powered by TypeScript, Docker, and Love",
            "thumbnailUrl":"https://avatars0.githubusercontent.com/u/25162437?s=200&v=4",
            "title":"Welcome to Wechaty",
            "url":"https://github.com/wechaty/wechaty"
        }
    }
} */
    msg = new bot.UrlLink(params.messagePayload)

  } else if (params.messageType === 'MiniProgram') {
    /* {
    "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
    "method":"thing.command.invoke",
    "version":"1.0",
    "timestamp":1610430718000,
    "name":"send",
    "params":{
        "toContacts":[
            "tyutluyc",
            "5550027590@chatroom"
        ],
        "messageType":"MiniProgram",
        "messagePayload":{
            "appid":"wx36027ed8c62f675e",
            "description":"群组大师群管理工具",
            "title":"群组大师",
            "pagePath":"pages/start/relatedlist/index.html",
            "thumbKey":"",
            "thumbUrl":"http://mmbiz.qpic.cn/mmbiz_jpg/mLJaHznUd7O4HCW51IPGVarcVwAAAuofgAibUYIct2DBPERYIlibbuwthASJHPBfT9jpSJX4wfhGEBnqDvFHHQww/0",
            "username":"gh_6c52e2baeb2d@app"
        }
    }
} */
    msg = new bot.MiniProgram(params.messagePayload)

  } else {
    return {
      msg: '不支持的消息类型',
    }
  }

  const toContacts = params.toContacts

  for (let i = 0; i < toContacts.length; i++) {
    if (toContacts[i].split('@').length === 2) {
      logger.info(`向群${toContacts[i]}发消息`)
      const room = await bot.Room.find({ id: toContacts[i] })
      if (room) {
        try {
          await room.say(msg)
        } catch (err) {
          console.error(err)
        }
      }
    } else {
      logger.info(`好友${toContacts[i]}发消息`)
      const contact = await bot.Contact.find({ id: toContacts[i] })
      if (contact) {
        try {
          await contact.say(msg)
        } catch (err) {
          console.error(err)
        }
      }
    }
  }

}

function getEventsMsg (eventName: any, msg: any) {
  const events: any = {}
  events[eventName] = msg
  let payload: any = {
    reqId: guid,
    method: 'thing.event.post',
    version: '1.0',
    timestamp: new Date().getTime(),
    events,
  }
  payload = JSON.stringify(payload)
  // logger.info(eventName)
  // print(eventName, payload)
  return payload
}

async function pubMsg (datasJsonStr: string) {
  const body = JSON.parse(datasJsonStr)
  const overRun = isOverRun(body)
  const url = `${process.env['URL']}/bot/${wxKey}/message`
  if (!overRun) {
    try {
      // 群组大师小程序提供的log接口

      try {
        const response = await axios.post(url, body, {
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.data.name === 'pubMessage') {
          await doSay(bot, response.data)
        }

        logger.info('Response:', response.data)
      } catch (error) {
        console.error('Error:', error)
      }

      // request(encodeURI(url), function (error, response, body) {
      //   console.error('error:', error); // Print the error if one occurred
      //   logger.info('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      //   // logger.info('body:', JSON.parse(body)); // Print the HTML for the Google homepage.
      //   // if (JSON.parse(body).data && JSON.parse(body).data.content) {

      //   //   // 小程序返回的活动报名信息发送到群
      //   //   message.say(JSON.parse(body).data.content)
      //   // }
      // });

    } catch (err) {
      print('pubMsg', err)
    }

  } else {
    const message = body.events.message
    const params = {
      room:message.room.roomid,
      toContacts:[
        message.user.wxid,
      ],
      messagePayload:'5秒以内请勿重复报名~',
    }
    await sendAt(bot, params)
    console.info('报名频率超限，不请求后端=======================================')
  }
  return true
}

function isOverRun (body: any) {
  let overRun = false
  if (body.events && body.events.message && body.events.message.user && body.events.message.user.wxid && body.events.message.text === '报名') {
    const wxid:string = body.events.message.user.wxid
    const cruTime:number = new Date().getTime()
    const lastTime = msgStore[wxid]

    if (lastTime && (cruTime - lastTime > 5000)) {
      msgStore[wxid] = cruTime
    } else if (!lastTime) {
      msgStore[wxid] = cruTime
    } else {
      overRun = true
    }
  }
  return overRun
}

async function doSay (bot: Wechaty, messageJson: any) {
  const obj = messageJson.params
  logger.info(messageJson, obj)
  let curTo: any = ''

  if (obj.wxKey === wxKey && obj.roomid) {
    curTo = await bot.Room.find({ id: obj.roomid })
  } else {
    curTo = await bot.Contact.find({ id: obj.wxid })
  }

  if (obj.msgType === 'Image') {
    // 1. send Image
    //   {
    //     "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
    //     "method":"thing.command.invoke",
    //     "version":"1.0",
    //     "timestamp":1610430718000,
    //     "name":"pubMessage",
    //     "params":{
    //         "id":"tyutluyc",
    //         "msg":"https://wechaty.github.io/wechaty/images/bot-qr-code.png",
    //         "roomid":"5550027590@chatroom",
    //         "wxKey":"choogoo",
    //         "msgType":"Image"
    //     }
    // }
    const fileBox = FileBox.fromUrl(obj.msg || 'https://wechaty.github.io/wechaty/images/bot-qr-code.png')
    await curTo.say(fileBox)
  } else if (obj.msgType === 'Text') {
    // 2. send Text
    //   {
    //     "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
    //     "method":"thing.command.invoke",
    //     "version":"1.0",
    //     "timestamp":1610430718000,
    //     "name":"pubMessage",
    //     "params":{
    //         "id":"tyutluyc",
    //         "msg":"dingdingding",
    //         "roomid":"5550027590@chatroom",
    //         "wxKey":"choogoo",
    //         "msgType":"Text"
    //     }
    // }
    if (obj.wxid && obj.roomid) {
      let atUserIdList = []
      if (obj.wxid instanceof Array) {
        atUserIdList = obj.wxid
      } else {
        atUserIdList = [ obj.wxid ]
      }
      const atUserList: Contact[] = []
      for (const userId of atUserIdList) {
        const curContact = await bot.Contact.find({ id: userId })
        if (curContact) {
          atUserList.push(curContact)
        }
      }
      logger.info('atUserList===============================', atUserList)
      await curTo.say(obj.msg, ...atUserList)
    } else {
      await curTo.say(obj.msg || 'dingdingding')
    }
  } else if (obj.msgType === 'Contact') {
    // 3. send Contact
    //   {
    //     "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
    //     "method":"thing.command.invoke",
    //     "version":"1.0",
    //     "timestamp":1610430718000,
    //     "name":"pubMessage",
    //     "params":{
    //         "id":"tyutluyc",
    //         "msg":"tyutluyc",
    //         "roomid":"5550027590@chatroom",
    //         "wxKey":"choogoo",
    //         "msgType":"Contact"
    //     }
    // }
    const contactCard = await bot.Contact.find({ id: obj.msg || 'tyutluyc' })
    if (!contactCard) {
      logger.info('not found')
      return
    }
    await curTo.say(contactCard)

  } else if (obj.msgType === 'UrlLink') {
    // 4. send UrlLink
    //   {
    //     "reqId":"442c1da4-9d3a-4f9b-a6e9-bfe858e4ac43",
    //     "method":"thing.command.invoke",
    //     "version":"1.0",
    //     "timestamp":1610430718000,
    //     "name":"pubMessage",
    //     "params":{
    //         "id":"tyutluyc",
    //         "msg":{
    //             "description":"测试卡片",
    //             "thumbnailUrl":"http://mmbiz.qpic.cn/mmbiz_jpg/mLJaHznUd7O4HCW51IPGVarcVwAAAuofgAibUYIct2DBPERYIlibbuwthASJHPBfT9jpSJX4wfhGEBnqDvFHHQww/0",
    //             "title":"欢迎使用群组大师小程序",
    //             "url":"https://mp.weixin.qq.com/s/m6qbYo6eFR8RbIj25Xm4rQ"
    //         },
    //         "roomid":"5550027590@chatroom",
    //         "wxKey":"choogoo",
    //         "msgType":"UrlLink"
    //     }
    // }
    const urlLink = new bot.UrlLink(obj.msg || {
      description: '群管理秘书',
      thumbnailUrl: 'http://mmbiz.qpic.cn/mmbiz_jpg/mLJaHznUd7O4HCW51IPGVarcVwAAAuofgAibUYIct2DBPERYIlibbuwthASJHPBfT9jpSJX4wfhGEBnqDvFHHQww/0',
      title: '微信群活动自动化管理工具，点击链接进入小程序',
      url: 'https://mp.weixin.qq.com/s/m6qbYo6eFR8RbIj25Xm4rQ',
    })
    await curTo.say(urlLink)

  } else if (obj.msgType === 'MiniProgram') {
    // 5. send MiniProgram (only supported by `wechaty-puppet-macpro`)
    if (obj.wxid && obj.roomid) {
      const miniProgramPayload = obj.msg
      logger.info(miniProgramPayload)
      const miniProgram = new bot.MiniProgram(miniProgramPayload)
      await curTo.say(miniProgram)
    } else {
      await curTo.say(obj.msg || 'dingdingding')
    }

  } else {
    logger.info('不支持的消息类型')
  }
}

export async function handleMessage (message:Message) {
  print('message', message)

  const contact = message.talker()
  const text = message.text()
  const talker = message.talker()
  let roomInfo = {}
  let alias = ''
  let member: Contact | undefined
  print('text', text)
  print('message.talker()', talker)
  // print('message.talker().id', message.talker().id)
  const room: Room | undefined = message.room() || undefined
  // print('room',room)

  const avatar = await contact.avatar()
  let avatarUrl: any = ''

  const currentUser = await bot.currentUser
  const atName = currentUser.name()
  if (room) {
    // const memberAlias =  await room.alias(currentUser)
    // if (memberAlias) {
    //   atName = memberAlias
    // }
    const newText = extractAtContent(`@${atName}`, text)
    if (newText !== null) {
      const res = await aide(newText)
      const resText = res.content
      await message.say(resText)
    }
  }

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

  // print('room', room)

  try {
    // print('@me', await message.mentionSelf())
    // print('message.text()', message.text())
    // print('talker', contact)
    // print('wxid', contact.id)
    // print('gender', contact.gender())
    // print('type', contact.type())
    // print('name', contact.name())
    // print('avatar', await contact.avatar())
    // print('alias', await contact.alias())
    // print('city', contact.city())
    // print('friend', contact.friend())
    // print('province', contact.province())
    // print('roomid', room.id)
    // print('room.topic()', await room.topic())
    if (room && room.id && room.owner()) {
      print('room', '有roomowner信息')
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
        // print('await room.memberAll()',await room.memberAll())
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
        // print('await room.memberAll()',await room.memberAll())
      }

    } else {
      print('room', '没有roomowner信息')
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
    wxKey,
    // content: 'X' + message.text(),
    alias,
    member,
    create_time: new Date().getTime(),
  }
  // logger.info(payload)
  payload = JSON.stringify(payload)
  print('payload', payload)

  payload = JSON.parse(payload)

  // mqttclient.publish(eventPost, getEventsMsg('message', payload));

  const reqMsg = getEventsMsg('message', payload)

  if (/[车找|人找|时间|打球报名]/i.test(text) && !message.self()) {
    // getTime(payload)
    // pubMsg(reqMsg)
    reqStore.push(reqMsg)
  } else if (!message.self()) {
    // pubMsg(reqMsg)
    reqStore.push(reqMsg)
  } else {
    logger.info('self message .......')
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

  // 2. send Text

  if (/^dong$/i.test(message.text())) {
    await message.say('dingdingding')
  }

  // 3. send Contact

  if (/^联系超哥$/i.test(message.text())) {
    const contactCard = await bot.Contact.find({ name: 'luyuchao' })
    if (!contactCard) {
      logger.info('not found')
      return
    }
    await message.say(contactCard)
  }

  // 4. send UrlLink
  if (/^彪悍的超哥$/i.test(message.text())) {
    const urlLink = new bot.UrlLink({
      description: '群管理秘书',
      thumbnailUrl: 'http://mmbiz.qpic.cn/mmbiz_jpg/mLJaHznUd7O4HCW51IPGVarcVwAAAuofgAibUYIct2DBPERYIlibbuwthASJHPBfT9jpSJX4wfhGEBnqDvFHHQww/0',
      title: '微信群活动自动化管理工具，点击链接进入小程序',
      url: 'https://mp.weixin.qq.com/s/m6qbYo6eFR8RbIj25Xm4rQ',
    })

    await message.say(urlLink)
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

export async function destroy (timerId:any) {
  clearInterval(timerId)
}

export async function updateContact (bot:Wechaty) {
  const contactList: undefined | Contact[] = await bot.Contact.findAll()
  const friendContactList = []
  const unfriendContactList = []

  if (contactList.length > 0) {
    for (let i = 0; i < contactList.length; i++) {
      if (contactList[i]?.friend()) {
        // logger.info(contactList[i])
        friendContactList.push(contactList[i])
      } else {
        // logger.info(contactList[i].id)
        unfriendContactList.push(contactList[i])
      }
    }
  }

  // logger.info(unfriendContactList)

  logger.info('list:', friendContactList.length, unfriendContactList.length)

  const roomList = await bot.Room.findAll()
  const userSelf = bot.ContactSelf
  // mqttclient.publish(eventPost, getEventsMsg('ready', { contactList, roomList, userSelf }));
  await pubMsg(getEventsMsg('ready', { friendContactList, roomList, userSelf }))
}

const mqttclient = mqtt.connect(`mqtt://${instanceId}.iot.gz.baidubce.com:1883`, {
  username,
  password,
  clientId,
  will: {
    topic: 'devicewill',
    payload: 'device disconnect',
    qos: 0,
    retain: false,
  },
})

mqttclient.on('connect', function () {
  logger.info('connect------------------------------------------------')
  mqttclient.subscribe(commandInvoke, function (err:any) {
    if (err) {
      logger.info(err)
    } else {
      logger.info(commandInvoke)

    }
  })
})

mqttclient.on('message', (topic: string, message: Buffer) => {
  (async () => {
    logger.info('message', '------------------------------------------------')
    try {
      const messageJson = JSON.parse(message.toString())
      // logger.info(messageJson)
      if (messageJson.params.wxid || messageJson.params.roomid) {
        await doSay(bot, messageJson)
      }
      if (messageJson.name === 'send') {
        await send(bot, messageJson.params)
      }
      if (messageJson.name === 'sendAt') {
        await sendAt(bot, messageJson.params)
      }
    } catch (err) {
      logger.error('err:', err)
    }
  })().catch(err => {
    logger.error('Unhandled error:', err)
  })
})
