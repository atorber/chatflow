import { FileBox } from 'file-box'
import {
  Contact,
  Wechaty,
  Room,
  log,
} from 'wechaty'

import { propertyMessage, eventMessage } from '../proxy/mqtt-proxy.js'

import {
  formatSentMessage,
  logger,
} from '../utils/utils.js'

import type { MqttProxy } from './mqtt-proxy.js'

// 接口文档参考 https://app.swaggerhub.com/apis/zixia/WechatyPuppet/0.20.16#/Puppet/Puppet_MessageImageStream
class WchatyAPI {

  private static bot: Wechaty
  private constructor () {

  }

  setWechaty (bot: Wechaty) {
    // log.info('bot info:', bot.currentUser.id)
    WchatyAPI.bot = bot
  }

  async contactsGet (mqttProxy: MqttProxy) {
    const contactList: Contact[] = await WchatyAPI.bot.Contact.findAll()
    let friends = []
    for (const i in contactList) {
      const contact = contactList[i]
      let avatar = ''
      try {
        avatar = JSON.parse(JSON.stringify(await contact?.avatar())).url
      } catch (err) {

      }
      const contactInfo = {
        alias: await contact?.alias() || '',
        avatar,
        gender: contact?.gender() || '',
        id: contact?.id,
        name: contact?.name() || '',
      }
      friends.push(contactInfo)

      if (friends.length === 100) {
        const msg = propertyMessage('contactList', friends)
        mqttProxy.pubProperty(msg)
        friends = []
      }
    }
    const msg = propertyMessage('contactList', friends)
    mqttProxy.pubProperty(msg)
  }

  async roomsGet (mqttProxy: MqttProxy) {
    const roomList = await WchatyAPI.bot.Room.findAll()
    for (const i in roomList) {
      const room = roomList[i]
      const roomInfo: any = {}
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
    mqttProxy.pubProperty(msg)
  }

  async send (params: any): Promise<any> {
    logger.info('params:' + JSON.stringify(params))

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
      const contactCard = await WchatyAPI.bot.Contact.find({ id: params.messagePayload })
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
        logger.info('图片http地址：', params.messagePayload)
        msg = FileBox.fromUrl(params.messagePayload)
      } else {
        logger.info('图片本地地址：', params.messagePayload)
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
      msg = params.messagePayload

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

    logger.info('远程发送消息 msg:' + msg)

    const toContacts = params.toContacts

    for (let i = 0; i < toContacts.length; i++) {
      if (toContacts[i].split('@').length === 2 || toContacts[i].split(':').length === 2) {
        logger.info(`向群${toContacts[i]}发消息`)
        try {
          const room: Room | undefined = await WchatyAPI.bot.Room.find({ id: toContacts[i] })
          if (room) {
            try {
              await room.say(msg)
              await formatSentMessage(WchatyAPI.bot.currentUser, msg, undefined, room)

              // 发送成功后向前端发送消息

            } catch (err) {
              logger.error('发送群消息失败：' + err)
            }
          }
        } catch (err) {
          log.error('获取群失败：', err)
          logger.error('获取群失败：' + err)
        }

      } else {
        logger.info(`好友${toContacts[i]}发消息`)
        // logger.info(bot)
        try {
          const contact: Contact | undefined = await WchatyAPI.bot.Contact.find({ id: toContacts[i] })
          if (contact) {
            try {
              await contact.say(msg)
              await formatSentMessage(WchatyAPI.bot.currentUser, msg, contact, undefined)
            } catch (err) {
              logger.error('发送好友消息失败：' + err)
            }
          }
        } catch (err) {
          log.error('获取好友失败：', err)
          logger.error('获取好友失败：' + err)
        }
      }
    }

  }

  async sendAt (params: any) {
    const atUserIdList = params.toContacts
    const room = await WchatyAPI.bot.Room.find({ id: params.room })
    const atUserList = []
    for (const userId of atUserIdList) {
      const curContact = await WchatyAPI.bot.Contact.find({ id: userId })
      atUserList.push(curContact)
    }
    await room?.say(params.messagePayload, ...atUserList)
    await formatSentMessage(WchatyAPI.bot.currentUser, params.messagePayload, undefined, room)
  }

  async createRoom (params: any) {
    const contactList: Contact[] = []
    for (const i in params.contactList) {
      const c = await WchatyAPI.bot.Contact.find({ name: params.contactList[i] })
      if (c) {
        contactList.push(c)
      }
    }

    const room = await WchatyAPI.bot.Room.create(contactList, params.topic)
    // logger.info('Bot', 'createDingRoom() new ding room created: %s', room)
    // await room.topic(params.topic)

    await room.say('你的专属群创建完成')
    await formatSentMessage(WchatyAPI.bot.currentUser, '你的专属群创建完成', undefined, room)
  }

  async getQrcod (params: any, mqttProxy: MqttProxy) {
    const roomId = params.roomId
    const room = await WchatyAPI.bot.Room.find({ id: roomId })
    const qr = await room?.qrCode()
    const msg = eventMessage('qrcode', qr)
    mqttProxy.pubEvent(msg)
  }

}

export { WchatyAPI }
export default WchatyAPI
