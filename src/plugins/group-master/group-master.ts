#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/* eslint-disable sort-keys */
import 'dotenv/config.js'
import { logForm } from '../../utils/utils.js'
import { v4 } from 'uuid'

import {
  WechatyPlugin,
  Contact,
  log,
  Wechaty,
} from 'wechaty'

import { FileBox } from 'file-box'
import mqtt from 'mqtt'
import axios from 'axios'
import { GroupMasterStore } from './store.js'
import { onMessage } from './on-message.js'

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
  log.info(typeof (params))
  log.info(params)

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
      log.info(`向群${toContacts[i]}发消息`)
      const room = await bot.Room.find({ id: toContacts[i] })
      if (room) {
        try {
          await room.say(msg)
        } catch (err) {
          console.error(err)
        }
      }
    } else {
      log.info(`好友${toContacts[i]}发消息`)
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

  return null
}

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
  // log.info(eventName, payload)
  return payload
}

function isOverRun (body: any) {
  let overRun = false
  if (body.events && body.events.message && body.events.message.user && body.events.message.user.wxid && body.events.message.text === '报名') {
    const wxid:string = body.events.message.user.wxid
    const cruTime:number = new Date().getTime()
    const lastTime = GroupMasterStore.msgStore[wxid]

    if (lastTime && (cruTime - lastTime > 5000)) {
      GroupMasterStore.msgStore[wxid] = cruTime
    } else if (!lastTime) {
      GroupMasterStore.msgStore[wxid] = cruTime
    } else {
      overRun = true
    }
  }
  return overRun
}

/**
 * GroupMaster 配置接口
 */
export interface GroupMasterConfig {
  /**
   * 微信密钥
   */
  WX_KEY: string;

  /**
   * MQTT 用户名
   */
  MQTT_USERNAME: string;

  /**
   * MQTT 密码
   */
  MQTT_PASSWORD: string;

  /**
   * MQTT 端点
   */
  MQTT_ENDPOINT: string;

  /**
   * MQTT 端口
   */
  MQTT_PORT: number;

  /**
   * 主机名
   */
  HOST: string;
}

function GroupMaster (
  config: GroupMasterConfig,
): WechatyPlugin {
  logForm('ChatFlow插件开始启动...\n\n启动过程需要30秒到1分钟\n\n请等待系统初始化...\n\n' + JSON.stringify(config))

  return function GroupMasterPlugin (bot: Wechaty): void {
    const wxKey = config.WX_KEY
    GroupMasterStore.wxKey = wxKey
    const password = config.MQTT_PASSWORD
    const username = config.MQTT_USERNAME
    const clientId = `wechaty-${wxKey}` + new Date().getTime()
    const commandInvoke = `thing/wechaty/${wxKey}/command/invoke`

    const mqttClient = mqtt.connect(`mqtt://${config.MQTT_ENDPOINT}:${config.MQTT_PORT}`, {
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

    mqttClient.on('connect', function () {
      log.info('connect------------------------------------------------')
      mqttClient.subscribe(commandInvoke, function (err:any) {
        if (err) {
          log.info(err)
        } else {
          log.info(commandInvoke)

        }
      })
    })

    mqttClient.on('message', (_topic: string, message: Buffer) => {
      (async () => {
        log.info('接收到MQTT消息:', message.toString())
        try {
          const messageJson = JSON.parse(message.toString())
          // log.info(messageJson)
          if (messageJson.params.wxid || messageJson.params.roomid) {
            await doSay(messageJson)
          }
          if (messageJson.name === 'send') {
            await send(bot, messageJson.params)
          }
          if (messageJson.name === 'sendAt') {
            await sendAt(bot, messageJson.params)
          }
        } catch (err) {
          log.error('MQTT消息解析失败:', err)
        }
      })().catch(err => {
        log.error('Unhandled error:', err)
      })
    })

    mqttClient.on('disconnect', (e: any) => {
      log.info('disconnect--------', e)
      mqttClient.reconnect()
    })

    async function pubMsg (datasJsonStr: string) {
      const body = JSON.parse(datasJsonStr)
      const overRun = isOverRun(body)
      const url = `${config.HOST}/bot/${wxKey}/message`
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
              await doSay(response.data)
            }

            log.info('群管理秘书API响应:', JSON.stringify(response.data))
          } catch (error) {
            console.error('Error:', error)
          }

        } catch (err) {
          log.info('pubMsg', err)
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

    async function doSay (messageJson: any) {
      const obj = messageJson.params
      log.info(messageJson, obj)
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
          log.info('atUserList===============================', atUserList)
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
          log.info('not found')
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
          log.info(miniProgramPayload)
          const miniProgram = new bot.MiniProgram(miniProgramPayload)
          await curTo.say(miniProgram)
        } else {
          await curTo.say(obj.msg || 'dingdingding')
        }

      } else {
        log.info('不支持的消息类型')
      }
    }

    bot.on('login', async (user) => {
      log.info('TestBot', `${user} login`)
      await pubMsg(getEventsMsg('login', { user }))

      GroupMasterStore.timerId = setInterval(() => {
        // log.info('待处理消息池长度：', reqStore.length||0);
        if (GroupMasterStore.reqStore.length) {
          log.info('待处理消息池长度：', GroupMasterStore.reqStore.length || 0)
          const req = GroupMasterStore.reqStore.splice(0, 1)
          try {
            pubMsg(req)
              .catch(e => {
                log.error('e', e)
              })
          } catch (err) {
            console.error('调用API服务失败：', err)
          }
        }
      }, 50)

    })
    bot.on('logout', async (user, reason) => {
      log.info('TestBot', `${user} logout, reason: ${reason}`)
      await pubMsg(getEventsMsg('logout', { reason, user }))
      clearInterval(GroupMasterStore.timerId)
    })

    bot.on('message', onMessage)

    bot.on('friendship', async (friendship) => {
      const contact: Contact = friendship.contact()
      if (friendship.type() === bot.Friendship.Type.Receive) { // 1. receive new friendship request from new contact
        // 自动通过好友请求并发送消息

        // await friendship.accept()
        // log.info(`Request from ${contact.name()} failed to accept!`)
        // const msg = '小程序相关问题可查看使用说明groupmaster.vlist.cc/\n wechat-qa-bot项目可查看项目知识库www.yuque.com/atorber/oegota\n 其他问题请留言，看到后会第一时间回复，特别紧急的问题可回复<紧急>二字联系超哥~'
        // await contact.say(msg)

        // contact = await bot.Contact.find({ name: contact.name() })
        // const room = await bot.Room.find({ topic: '全都是超哥' })
        // if (room) {
        //     try {
        //         await room.add(contact)
        //     } catch (e) {
        //         console.error(e)
        //     }
        // } else {
        //     log.info('群不存在~')
        // }

      } else if (friendship.type() === bot.Friendship.Type.Confirm) { // 2. confirm friendship
        log.info(`New friendship confirmed with ${contact.name()}`)
        // const msg = '小程序相关问题可查看使用说明groupmaster.vlist.cc\n ChatFlow项目可查看项目知识库www.yuque.com/atorber/chatflow\n 其他问题请留言，看到后会第一时间回复，特别紧急的问题可回复<紧急>二字联系超哥~'
        // await contact.say(msg)
        // let msg:any = `nice to meet you~`
        // await contact.say(msg)

        /*             contact = await bot.Contact.find({ name: contact.name() })
                      const room = await bot.Room.find({ topic: '全都是超哥' })
                      if (room) {
                          try {
                              await room.add(contact)
                          } catch (e) {
                              console.error(e)
                          }
                      } else {
                          log.info('群不存在~')
                      } */
      }
      await pubMsg(getEventsMsg('friendship', { friendship }))
    })
    bot.on('room-join', async (room, inviteeList, inviter) => {
      const nameList = inviteeList.map(c => c.name()).join(',')
      log.info(`Room ${await room.topic()} got new member ${nameList}, invited by ${inviter}`)
      await pubMsg(getEventsMsg('room-join', { room, inviteeList, inviter }))

      // let msg = `热烈欢迎@${nameList} 加入群~`
      // room.say(msg)
    })
    bot.on('room-leave', async (room, leaverList, remover) => {
      const nameList = leaverList.map(c => c.name()).join(',')
      log.info(`Room ${await room.topic()} lost member ${nameList}, the remover is: ${remover}`)
      await pubMsg(getEventsMsg('room-leave', { room, leaverList, remover }))

      // let msg:any = `很遗憾，${nameList}离开了群~`
      // room.say(msg)

    })
    bot.on('room-topic', async (room, topic, oldTopic, changer) => {
      log.info(`Room ${await room.topic()} topic changed from ${oldTopic} to ${topic} by ${changer.name()}`)
      await pubMsg(getEventsMsg('room-topic', { room, topic, oldTopic, changer }))

    })
    bot.on('room-invite', async roomInvitation => {
      try {
        log.info('received room-invite event.')
        await roomInvitation.accept()
        await pubMsg(getEventsMsg('room-invite', { roomInvitation: await roomInvitation.accept() }))

      } catch (e) {
        console.error(e)
        await pubMsg(getEventsMsg('room-invite', { roomInvitation: e }))

      }
    })
    bot.on('error', async (error) => {
      log.error('TestBot', 'on error: ', error.stack)
      await pubMsg(getEventsMsg('error', { error }))

    })

  }

}

export {
  GroupMaster,
}
