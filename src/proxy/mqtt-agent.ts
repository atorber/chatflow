import { FileBox } from 'file-box'
import {
  Contact,
  Wechaty,
  Room,
  log,
} from 'wechaty'

import { propertyMessage, eventMessage } from '../plugins/msg-format.js'

import {
  formatSentMessage,
  logger,
} from '../utils/utils.js'

import type { MqttProxy } from './mqtt-proxy.js'

class MQTTAgent {

  private static bot: Wechaty

  private static mqttProxy: MqttProxy

  private constructor () {}

  static handleMQTTMessage (name:string, params:any) {
    const that = this as any
    if (that[name] && typeof that[name] === 'function') {
      that[name](params)
    } else {
      throw new Error("MQTTAgent don't have this method")
    }
  }

  setWechaty (bot: Wechaty) {
    // log.info('bot info:', bot.currentUser.id)
    MQTTAgent.bot = bot
  }

  setMqttProxy (mqttProxy: MqttProxy) {
    // log.info('bot info:', bot.currentUser.id)
    MQTTAgent.mqttProxy = mqttProxy
  }

  // 启动wechaty
  async wechatyStart (params:any) {
    log.info('params:' + JSON.stringify(params))
  }

  // 停止wechaty
  async wechatyStop (params:any) {
    log.info('params:' + JSON.stringify(params))
  }

  // 注销wechaty
  async wechatyLogout (params:any) {
    log.info('params:' + JSON.stringify(params))
  }

  // 检查wechaty的登录状态
  async wechatyLogonoff (params:any) {
    log.info('params:' + JSON.stringify(params))
  }

  // 获取wechaty当前用户自己的信息
  async wechatyUserSelf (params:any) {
    log.info('params:' + JSON.stringify(params))
  }

  // 让wechaty发送消息
  async wechatySay (params:any) {
    log.info('params:' + JSON.stringify(params))
  }

  // 查找消息
  async messageFind (params:any) {
    log.info('params:' + JSON.stringify(params))
  }

  // 查找所有消息
  async messageFindAll (params:any) {
    log.info('params:' + JSON.stringify(params))
  }

  // 发送消息
  async messageSay (params:any) {
    log.info('params:' + JSON.stringify(params))
  }

  // 获取被撤回的消息
  async messageToRecalled (params:any) {
    log.info('params:' + JSON.stringify(params))
  }

  // 让联系人说话
  async contactSay (params:any) {
    log.info('params:' + JSON.stringify(params))
  }

  // 查找联系人
  async contactFind (params:any) {
    log.info('params:' + JSON.stringify(params))
  }

  // 查找所有联系人
  async contactFindAll (params:any) {
    log.info('params:' + JSON.stringify(params))
  }

  // 让房间发送消息
  async roomSay (params:any) {
    log.info('params:' + JSON.stringify(params))
  }

  // 设置房间主题
  async roomTopic (params:any) {
    log.info('params:' + JSON.stringify(params))
  }

  // 发布房间公告
  async roomAnnounce (params:any) {
    log.info('params:' + JSON.stringify(params))
  }

  // 获取房间二维码
  async roomQrcode (params:any) {
    log.info('params:' + JSON.stringify(params))
  }

  // 获取房间别名
  async roomAlias (params:any) {
    log.info('params:' + JSON.stringify(params))
  }

  // 添加成员到房间
  async roomAdd (params:any) {
    log.info('params:' + JSON.stringify(params))
  }

  // 从房间删除成员
  async roomDel (params:any) {
    log.info('params:' + JSON.stringify(params))
  }

  // 退出房间
  async roomQuit (params:any) {
    log.info('params:' + JSON.stringify(params))
  }

  // 检查成员是否在房间内
  async roomHas (params:any) {
    log.info('params:' + JSON.stringify(params))
  }

  // 获取房间内所有成员
  async roomMemberAll (params:any) {
    log.info('params:' + JSON.stringify(params))
  }

  // 获取房间成员
  async roomMember (params:any) {
    log.info('params:' + JSON.stringify(params))
  }

  // 创建房间
  async roomCreate (params:any) {
    log.info('params:' + JSON.stringify(params))
  }

  // 查找所有房间
  async roomFindAll (params:any) {
    log.info('params:' + JSON.stringify(params))
  }

  // 查找房间
  async roomFind (params:any) {
    log.info('params:' + JSON.stringify(params))
  }

  // 接受房间邀请
  async roomInvitationAccept (params:any) {
    log.info('params:' + JSON.stringify(params))
  }

  // 查找所有房间邀请
  async roomInvitationFindAll (params:any) {
    log.info('params:' + JSON.stringify(params))
  }

  // 获取邀请人信息
  async roomInvitationInviter (params:any) {
    log.info('params:' + JSON.stringify(params))
  }

  // 接受好友请求
  async friendshipAccept (params:any) {
    log.info('params:' + JSON.stringify(params))
  }

  // 搜索好友
  async friendshipSearch (params:any) {
    log.info('params:' + JSON.stringify(params))
  }

  // 添加好友
  async friendshipAdd (params:any) {
    log.info('params:' + JSON.stringify(params))
  }

  async contactsGet () {
    const contactList: Contact[] = await MQTTAgent.bot.Contact.findAll()
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
        MQTTAgent.mqttProxy.pubProperty(msg)
        friends = []
      }
    }
    const msg = propertyMessage('contactList', friends)
    MQTTAgent.mqttProxy.pubProperty(msg)
  }

  async roomsGet () {
    const roomList = await MQTTAgent.bot.Room.findAll()
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
    MQTTAgent.mqttProxy.pubProperty(msg)
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
      const contactCard = await MQTTAgent.bot.Contact.find({ id: params.messagePayload })
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
          const room: Room | undefined = await MQTTAgent.bot.Room.find({ id: toContacts[i] })
          if (room) {
            try {
              await room.say(msg)
              await formatSentMessage(MQTTAgent.bot.currentUser, msg, undefined, room)

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
          const contact: Contact | undefined = await MQTTAgent.bot.Contact.find({ id: toContacts[i] })
          if (contact) {
            try {
              await contact.say(msg)
              await formatSentMessage(MQTTAgent.bot.currentUser, msg, contact, undefined)
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
    const room = await MQTTAgent.bot.Room.find({ id: params.room })
    const atUserList = []
    for (const userId of atUserIdList) {
      const curContact = await MQTTAgent.bot.Contact.find({ id: userId })
      atUserList.push(curContact)
    }
    await room?.say(params.messagePayload, ...atUserList)
    await formatSentMessage(MQTTAgent.bot.currentUser, params.messagePayload, undefined, room)
  }

  async createRoom (params: any) {
    const contactList: Contact[] = []
    for (const i in params.contactList) {
      const c = await MQTTAgent.bot.Contact.find({ name: params.contactList[i] })
      if (c) {
        contactList.push(c)
      }
    }

    const room = await MQTTAgent.bot.Room.create(contactList, params.topic)
    // logger.info('Bot', 'createDingRoom() new ding room created: %s', room)
    // await room.topic(params.topic)

    await room.say('你的专属群创建完成')
    await formatSentMessage(MQTTAgent.bot.currentUser, '你的专属群创建完成', undefined, room)
  }

  async getQrcod (params: any) {
    const roomId = params.roomId
    const room = await MQTTAgent.bot.Room.find({ id: roomId })
    const qr = await room?.qrCode()
    const msg = eventMessage('qrcode', qr)
    MQTTAgent.mqttProxy.pubEvent(msg)
  }

}

export { MQTTAgent }
export default MQTTAgent
