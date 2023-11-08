import mqtt, { MqttClient, IClientOptions } from 'mqtt'
import { v4 } from 'uuid'
import { FileBox } from 'file-box'
import {
  Contact,
  Wechaty,
  Room,
  log,
} from 'wechaty'
import { wechaty2mqtt, propertyMessage, eventMessage } from '../plugins/msg-format.js'
import CryptoJS from 'crypto-js'
import {
  formatSentMessage,
  logger,
} from '../utils/utils.js'

import { MQTTAgent } from './mqtt-agent.js'

class MqttProxy {

  private static instance: MqttProxy | undefined
  private static chatbot: Wechaty
  bot!: Wechaty
  private mqttClient: MqttClient
  private messageQueue: Array<{ topic: string; message: string }> = []
  private isConnected: boolean = false
  propertyApi: string
  eventApi: string
  commandApi: string
  isOk: boolean

  static getClientId (clientString:string) {
    // clientid加密
    const clientId = CryptoJS.SHA256(clientString).toString()
    return clientId
  }

  private constructor (config: IClientOptions) {
    this.propertyApi = `thing/chatbot/${config.clientId}/property/post`
    this.eventApi = `thing/chatbot/${config.clientId}/event/post`
    this.commandApi = `thing/chatbot/${config.clientId}/command/invoke`
    this.isOk = false
    // 重写clientID为随机id，防止重复
    config.clientId = v4()
    this.mqttClient = mqtt.connect(config)

    this.mqttClient.on('connect', () => {
      log.info('MQTT连接成功...')
      this.isConnected = true
      // 发送所有排队的消息
      this.messageQueue.forEach(({ topic, message }) => {
        this.mqttClient.publish(topic, message)
      })
      // 清空消息队列
      this.messageQueue = []
    })

    this.mqttClient.on('error', (error) => {
      console.error('MQTT error:', error)
      this.isConnected = false
    })

    this.mqttClient.on('close', () => {
      log.info('MQTT connection closed')
      this.isConnected = false
    })

    this.mqttClient.on('disconnect', (e: any) => {
      log.info('disconnect--------', e)
      this.isConnected = false
    })

    this.mqttClient.on('message', MqttProxy.onMessage.bind(this))
    this.subCommand()
    this.isOk = true
  }

  setWechaty (bot: Wechaty) {
    // log.info('bot info:', bot.currentUser.id)
    MqttProxy.chatbot = bot
    this.bot = bot
  }

  public static getInstance (config?: IClientOptions): MqttProxy|undefined {
    if (!MqttProxy.instance && config) {
      MqttProxy.instance = new MqttProxy(config)
    }
    return MqttProxy.instance
  }

  public publish (topic: string, message: string) {
    if (this.isConnected) {
      this.mqttClient.publish(topic, message, (error) => {
        if (error) {
          console.error(`Failed to publish message: ${error}`)
        }
      })
    } else {
      log.info('MQTT client not connected. Queueing message.')
      this.messageQueue.push({ topic, message })
    }
  }

  subCommand () {
    this.mqttClient.subscribe(this.commandApi, function (err: any) {
      if (err) {
        logger.info(err)
      }
    })
  }

  pubProperty (msg: any) {
    this.mqttClient.publish(this.propertyApi, msg)
    logger.info('mqtt消息发布:' + this.eventApi, msg)
  }

  pubEvent (msg: any) {
    this.mqttClient.publish(this.eventApi, msg)
    logger.info('mqtt消息发布:' + this.eventApi, msg)
  }

  async pubMessage (msg: any) {
    try {
      const payload = await wechaty2mqtt(msg)
      this.mqttClient.publish(this.eventApi, payload)
      logger.info('mqtt消息发布:' + this.eventApi, payload)
    } catch (err) {
      console.error(err)
    }

  }

  getBot () {
    return this.bot
  }

  private static onMessage = (topic: string, message: any) => {
    logger.info('mqtt onMessage:' + topic)
    logger.info('mqtt onMessage:' + message.toString())
    log.info('MqttProxy.chatbot', MqttProxy.chatbot)
    try {
      // const content = JSON.parse(message.toString())
      message = JSON.parse(message)
      const name = message.name
      const params = message.params

      // 接收到mqtt消息后，调用mqttAgent处理
      MQTTAgent.handleMQTTMessage(name, params)

      if (MqttProxy.instance) {
        if (name === 'start') {
          logger.info('cmd name:' + name)
        }
        if (name === 'stop') {
          logger.info('cmd name:' + name)
        }
        if (name === 'logout') {
          logger.info('cmd name:' + name)

        }
        if (name === 'logonoff') {
          logger.info('cmd name:' + name)

        }
        if (name === 'userSelf') {
          logger.info('cmd name:' + name)

        }
        if (name === 'say') {
          logger.info('cmd name:' + name)

        }
        if (name === 'send') {
          send(params, MqttProxy.chatbot)
            .then(res => {
              log.info('send res:', res)
              return res
            }).catch(err => {
              log.error('send err:', err)
            })
        }
        if (name === 'sendAt') {
          sendAt(params, MqttProxy.chatbot)
            .then(res => {
              log.info('sendAt res:', res)
              return res

            }).catch(err => {
              log.error('sendAt err:', err)
            })
        }

        if (name === 'aliasGet') {
          logger.info('cmd name:' + name)

        }
        if (name === 'aliasSet') {
          logger.info('cmd name:' + name)

        }
        if (name === 'roomCreate') {
          createRoom(params, MqttProxy.chatbot)
            .then(res => {
              log.info('roomCreate res:', res)
              return res
            }).catch(err => {
              log.error('roomCreate err:', err)
            })
        }
        if (name === 'roomAdd') {
          logger.info('cmd name:' + name)

        }
        if (name === 'roomDel') {
          logger.info('cmd name:' + name)

        }
        if (name === 'roomAnnounceGet') {
          logger.info('cmd name:' + name)

        }
        if (name === 'roomAnnounceSet') {
          logger.info('cmd name:' + name)

        }
        if (name === 'roomQuit') {
          logger.info('cmd name:' + name)

        }
        if (name === 'roomTopicGet') {
          logger.info('cmd name:' + name)

        }
        if (name === 'roomTopicSet') {
          logger.info('cmd name:' + name)

        }
        if (name === 'roomQrcodeGet') {
          getQrcod(params, MqttProxy.chatbot, MqttProxy.instance).then(res => {
            log.info('roomQrcodeGet res:', res)
            return res

          }).catch(err => {
            log.error('roomQrcodeGet err:', err)
          })

        }
        if (name === 'memberAllGet') {
          logger.info('cmd name:' + name)

        }
        if (name === 'contactAdd') {
          logger.info('cmd name:' + name)

        }
        if (name === 'contactAliasSet') {
          logger.info('cmd name:' + name)

        }
        if (name === 'contactFindAll') {
          getAllContact(MqttProxy.instance, MqttProxy.chatbot).then(res => {
            log.info('contactFindAll res:', res)
            return res

          }).catch(err => {
            log.error('contactFindAll err:', err)
          })
        }
        if (name === 'contactFind') {
          logger.info('cmd name:' + name)

        }
        if (name === 'roomFindAll') {

          getAllRoom(MqttProxy.instance, MqttProxy.chatbot).then(res => {
            log.info('roomFindAll res:', res)
            return res

          }).catch(err => {
            log.error('roomFindAll err:', err)
          })

        }
        if (name === 'roomFind') {
          logger.info('cmd name:' + name)

        }
        if (name === 'config') {
          logger.info('cmd name:' + name)

        }
      }
    } catch (err) {
      logger.error('MQTT接收到消息错误：' + err)
    }
  }

  static onMessage2 = (topic: string, message: any) => {
    const logCommand = (name: string) => logger.info(`cmd name: ${name}`)
    const processCommand = (name: string, action: any) => {
      logCommand(name)
      if (action) {
        action().then((res: any) => {
          log.info(`${name} res:`, res)
          return res
        }).catch((err: any) => {
          log.error(`${name} err:`, err)
        })
      }
    }

    logger.info(`mqtt onMessage: ${topic}`)
    logger.info(`mqtt onMessage: ${message.toString()}`)
    log.info('MqttProxy.chatbot', MqttProxy.chatbot)

    const mqttProxy = MqttProxy.instance
    if (mqttProxy) {
      try {
        message = JSON.parse(message)
        const { name, params } = message
        switch (name) {
          case 'wechaty.start':
          case 'wechaty.stop':
          case 'wechaty.logout':
          case 'wechaty.logonoff':
          case 'wechaty.userSelf':
          case 'wechaty.say':
          case 'message.find':
          case 'message.findAll':
          case 'message.say':
          case 'message.toRecalled':
          case 'contact.say':
          case 'contact.find':
          case 'contact.findAll':
          case 'room.say':
          case 'room.topic':
          case 'room.announce':
          case 'room.qrcode':
          case 'room.alias':
          case 'room.add':
          case 'room.del':
          case 'room.quit':
          case 'room.has':
          case 'room.memberAll':
          case 'room.member':
          case 'room.create':
          case 'room.findAll':
          case 'room.find':
          case 'roomInvitation.accept':
          case 'roomInvitation.findAll':
          case 'roomInvitation.inviter':
          case 'friendship.accept':
          case 'Friendship.search':
          case 'Friendship.add':
            logCommand(name)
            break
          case 'send':
            processCommand(name, () => send(params, MqttProxy.chatbot))
            break
          case 'sendAt':
            processCommand(name, () => sendAt(params, MqttProxy.chatbot))
            break
          case 'roomCreate':
            processCommand(name, () => createRoom(params, MqttProxy.chatbot))
            break
          case 'roomQrcodeGet':
            processCommand(name, () => getQrcod(params, MqttProxy.chatbot, mqttProxy))
            break
          case 'contactFindAll':
            processCommand(name, () => getAllContact(mqttProxy, MqttProxy.chatbot))
            break
          case 'roomFindAll':
            processCommand(name, () => getAllRoom(mqttProxy, MqttProxy.chatbot))
            break
          default:
            log.error('Unknown command:', name)
        }

      } catch (err) {
        logger.error(`MQTT接收到消息错误: ${err}`)
      }
    }
  }

}

async function getAllContact (mqttProxy: MqttProxy, bot: Wechaty) {
  const contactList: Contact[] = await bot.Contact.findAll()
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

async function getAllRoom (mqttProxy: MqttProxy, bot: Wechaty) {
  const roomList = await bot.Room.findAll()
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

async function send (params: any, bot: Wechaty): Promise<any> {
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
        const room: Room | undefined = await bot.Room.find({ id: toContacts[i] })
        if (room) {
          try {
            await room.say(msg)
            await formatSentMessage(bot.currentUser, msg, undefined, room)

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
        const contact: Contact | undefined = await bot.Contact.find({ id: toContacts[i] })
        if (contact) {
          try {
            await contact.say(msg)
            await formatSentMessage(bot.currentUser, msg, contact, undefined)
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

async function sendAt (params: any, bot: Wechaty) {
  const atUserIdList = params.toContacts
  const room = await bot.Room.find({ id: params.room })
  const atUserList = []
  for (const userId of atUserIdList) {
    const curContact = await bot.Contact.find({ id: userId })
    atUserList.push(curContact)
  }
  await room?.say(params.messagePayload, ...atUserList)
  await formatSentMessage(bot.currentUser, params.messagePayload, undefined, room)
}

async function createRoom (params: any, bot: Wechaty) {
  const contactList: Contact[] = []
  for (const i in params.contactList) {
    const c = await bot.Contact.find({ name: params.contactList[i] })
    if (c) {
      contactList.push(c)
    }
  }

  const room = await bot.Room.create(contactList, params.topic)
  // logger.info('Bot', 'createDingRoom() new ding room created: %s', room)
  // await room.topic(params.topic)

  await room.say('你的专属群创建完成')
  await formatSentMessage(bot.currentUser, '你的专属群创建完成', undefined, room)
}

async function getQrcod (params: any, bot: Wechaty, mqttProxy: MqttProxy) {
  const roomId = params.roomId
  const room = await bot.Room.find({ id: roomId })
  const qr = await room?.qrCode()
  const msg = eventMessage('qrcode', qr)
  mqttProxy.pubEvent(msg)
}

export { MqttProxy }
export type { IClientOptions }
export default MqttProxy
