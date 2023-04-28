/* eslint-disable no-empty */
/* eslint-disable sort-keys */
import mqtt from 'mqtt'
import { v4 } from 'uuid'
import { FileBox } from 'file-box'
import {
  // Contact,
  log,
  Contact,
  //   Message,
  //   ScanStatus,
  Wechaty,
//   UrlLink,
//   MiniProgram,
} from 'wechaty'
import { wechaty2chatdev, propertyMessage, eventMessage } from './msg-format.js'

import {
  // waitForMs as wait,
  formatSentMessage,
} from '../util/tool.js'

class ChatDevice {

  chatbot!:any
  chatdevice!:any
  bot!: Wechaty
  mqttclient:any
  isConnected:any
  propertyApi:string
  eventApi:string
  commandApi:string
  constructor (username:string, password:string, endpoint:string, port:string|number, botId:string) {

    this.mqttclient = mqtt.connect(`mqtt://${endpoint}:${port || 1883}`, {
      username,
      password,
      clientId: v4(),
    })
    this.isConnected = false
    this.propertyApi = `thing/chatbot/${botId}/property/post`
    this.eventApi = `thing/chatbot/${botId}/event/post`
    this.commandApi = `thing/chatbot/${botId}/command/invoke`
  }

  init (bot:Wechaty) {
    this.chatbot = bot
    this.chatdevice = this
    this.bot = bot
    const that = this
    this.mqttclient.on('connect', function () {
      that.isConnected = true
      log.info('================================================\n\nMQTT连接成功~\n\n================================================\n')
    })
    this.mqttclient.on('reconnect', function (e:any) {
      log.info('subscriber on reconnect')
    })
    this.mqttclient.on('disconnect', function (e:any) {
      log.info('disconnect--------', e)
      that.isConnected = false
    })
    this.mqttclient.on('error', function (e:any) {
      log.info('error----------', e)
    })
    this.mqttclient.on('message', this.onMessage)
    this.sub_command()
  }

  sub_command () {
    this.mqttclient.subscribe(this.commandApi, function (err:any) {
      if (err) {
        log.info(err)
      }
    })
  }

  pub_property (msg:any) {
    this.mqttclient.publish(this.propertyApi, msg)
  }

  pub_event (msg:any) {
    this.mqttclient.publish(this.eventApi, msg)
  }

  async pub_message (msg:any) {
    try {
      const payload = await wechaty2chatdev(msg)
      this.mqttclient.publish(this.eventApi, payload)
    } catch (err) {
      console.error(err)
    }

  }

  getBot () {
    return this.bot
  }

  async onMessage (topic:string, message:any) {
    log.info('mqtt onMessage:', topic, message.toString())
    // const content = JSON.parse(message.toString())
    message = JSON.parse(message)
    const name = message.name
    const params = message.params

    if (name === 'start') {

    }
    if (name === 'stop') {

    }
    if (name === 'logout') {

    }
    if (name === 'logonoff') {

    }
    if (name === 'userSelf') {

    }
    if (name === 'say') {

    }
    if (name === 'send') {
      await send(params, this.chatbot)
    }
    if (name === 'sendAt') {
      await sendAt(params, this.chatbot)
    }

    if (name === 'aliasGet') {

    }
    if (name === 'aliasSet') {

    }
    if (name === 'roomCreate') {
      await createRoom(params, this.chatbot)
    }
    if (name === 'roomAdd') {

    }
    if (name === 'roomDel') {

    }
    if (name === 'roomAnnounceGet') {

    }
    if (name === 'roomAnnounceSet') {

    }
    if (name === 'roomQuit') {

    }
    if (name === 'roomTopicGet') {

    }
    if (name === 'roomTopicSet') {

    }
    if (name === 'roomQrcodeGet') {
      await getQrcod(params, this.chatbot, this.chatdevice)

    }
    if (name === 'memberAllGet') {

    }
    if (name === 'contactAdd') {

    }
    if (name === 'contactAliasSet') {

    }
    if (name === 'contactFindAll') {
      await getAllContact(this.chatdevice, this.chatbot)
    }
    if (name === 'contactFind') {

    }
    if (name === 'roomFindAll') {
      await getAllRoom(this.chatdevice, this.chatbot)
    }
    if (name === 'roomFind') {

    }
    if (name === 'config') {

    }

  }

}

async function getAllContact (chatdevice:any, bot:Wechaty) {
  const contactList:Contact[] = await bot.Contact.findAll()
  let friends = []
  for (const i in contactList) {
    const contact = contactList[i]
    let avatar = ''
    try {
      avatar = JSON.parse(JSON.stringify(await contact?.avatar())).url
    } catch (err) {

    }
    const contactInfo = {
      id: contact?.id,
      gender: contact?.gender() || '',
      name: contact?.name() || '',
      alias: await contact?.alias() || '',
      avatar,
    }
    friends.push(contactInfo)

    if (friends.length === 100) {
      const msg = propertyMessage('contactList', friends)
      chatdevice.pub_property(msg)
      friends = []
    }
  }
  const msg = propertyMessage('contactList', friends)
  chatdevice.pub_property(msg)

}

async function getAllRoom (chatdevice:any, bot:Wechaty) {
  const roomList = await bot.Room.findAll()
  for (const i in roomList) {
    const room = roomList[i]
    const roomInfo:any = {}
    roomInfo.id = room?.id

    const avatar = await room?.avatar()
    roomInfo.avatar = JSON.parse(JSON.stringify(avatar)).url

    roomInfo.ownerId = room?.owner()?.id
    try {
      roomInfo.topic = await room?.topic()
    } catch (err) {
      roomInfo.topic = room?.id
    }
    roomList[i] = roomInfo
  }
  const msg = propertyMessage('roomList', roomList)
  chatdevice.pub_property(msg)
}

async function send (params:any, bot:Wechaty) {
  log.info('params:', params)

  let msg:any = ''
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
      log.info('not found')
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
      log.info('图片http地址：', params.messagePayload)
      msg = FileBox.fromUrl(params.messagePayload)
    } else {
      log.info('图片本地地址：', params.messagePayload)
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
    msg =  params.messagePayload

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
    msg = params.messagePayload

  } else {
    return {
      msg: '不支持的消息类型',
    }
  }

  log.info('msg:', msg)

  const toContacts = params.toContacts

  for (let i = 0; i < toContacts.length; i++) {
    if (toContacts[i].split('@').length === 2 || toContacts[i].split(':').length === 2) {
      log.info(`向群${toContacts[i]}发消息`)
      const room = await bot.Room.find({ id: toContacts[i] })
      if (room) {
        try {
          await room.say(msg)
          await formatSentMessage(bot.currentUser, msg, undefined, room)
        } catch (err) {
          console.error(err)
        }
      }
    } else {
      log.info(`好友${toContacts[i]}发消息`)
      // log.info(bot)
      const contact = await bot.Contact.find({ id: toContacts[i] })
      if (contact) {
        try {
          await contact.say(msg)
          await formatSentMessage(bot.currentUser, msg, contact, undefined)
        } catch (err) {
          console.error(err)
        }
      }
    }
  }

}

async function sendAt (params:any, bot:Wechaty) {
  const atUserIdList = params.toContacts
  const room = await bot.Room.find({ id: params.room })
  const atUserList = []
  for (const userId of atUserIdList) {
    const curContact = await bot.Contact.find({ id:userId })
    atUserList.push(curContact)
  }
  await room?.say(params.messagePayload, ...atUserList)
  await formatSentMessage(bot.currentUser, params.messagePayload, undefined, room)
}

async function createRoom (params:any, bot:Wechaty) {
  const contactList:Contact[] = []
  for (const i in params.contactList) {
    const c = await bot.Contact.find({ name: params.contactList[i] })
    if (c) {
      contactList.push(c)
    }
  }

  const room = await bot.Room.create(contactList, params.topic)
  // log.info('Bot', 'createDingRoom() new ding room created: %s', room)
  // await room.topic(params.topic)

  await room.say('你的专属群创建完成')
  await formatSentMessage(bot.currentUser, '你的专属群创建完成', undefined, room)
}

async function getQrcod (params:any, bot:Wechaty, chatdevice:any) {
  const roomId = params.roomId
  const room = await bot.Room.find({ id: roomId })
  const qr = await room?.qrCode()
  const msg = eventMessage('qrcode', qr)
  chatdevice.pub_event(msg)
}

export { ChatDevice }
export default ChatDevice
