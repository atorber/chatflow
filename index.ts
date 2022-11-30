#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable no-console */
/* eslint-disable eqeqeq */
/* eslint-disable camelcase */
/* eslint-disable sort-keys */
import 'dotenv/config.js'
import fs from 'fs'

import {
  Contact,
  // Room,
  Message,
  ScanStatus,
  WechatyBuilder,
  log,
  Room,
  // types,
} from 'wechaty'
// import * as PUPPET from 'wechaty-puppet'
// import {
//   OneToManyRoomConnector,
//   OneToManyRoomConnectorConfig,
//   ManyToOneRoomConnector,
//   ManyToOneRoomConnectorConfig,
// } from 'wechaty-plugin-contrib'

import qrcodeTerminal from 'qrcode-terminal'

// import WechatyVikaPlugin from 'wechaty-vika-link'
import WechatyVikaPlugin from './src/index.js'

import { FileBox } from 'file-box'
import configs from './config.js'
// import type { Puppet } from 'wechaty-puppet'
import * as io from 'socket.io-client'
import { VikaBot } from './src/vika.js'
import { configData } from './src/plugins/im.js'
import { wxai } from './src/plugins/wxai.js'

import { ChatDevice } from './src/plugins/chat-device.js'

// import schedule from 'node-schedule'

let bot: any
let sysConfig: any
let chatdev: any
if (process.env['VIKA_SPACENAME']) {
  configs.VIKA_SPACENAME = process.env['VIKA_SPACENAME']
}

if (process.env['VIKA_TOKEN']) {
  configs.VIKA_TOKEN = process.env['VIKA_TOKEN']
}

const vikaConfig = {
  spaceName: configs.VIKA_SPACENAME,
  token: configs.VIKA_TOKEN,
}
// console.debug(vikaConfig)
const vika = new VikaBot(vikaConfig)

async function main() {
  void await vika.checkInit()
  // 获取系统配置信息
  const configsRes = await vika.getConfig()
  sysConfig = configsRes[0]
  log.info(sysConfig)

  configs.roomWhiteList = configsRes[1]
  configs.welcomeList = [] // 进群欢迎语白名单

  sysConfig = { ...configs, ...sysConfig }
  log.info(sysConfig)
  // console.debug(sysConfig)

  const wechatyConfig: any = {
    // 网页版微信
    'wechaty-puppet-wechat': {
      name: 'openai-qa-bot',
      puppet: 'wechaty-puppet-wechat',
      puppetOptions: {
        uos: true,
      },
    },
    // Windows桌面版微信
    'wechaty-puppet-xp': {
      name: 'openai-qa-bot',
      puppet: 'wechaty-puppet-xp',
    },
    // pad-local
    'wechaty-puppet-padlocal': {
      name: 'openai-qa-bot',
      puppet: 'wechaty-puppet-padlocal',
      puppetOptions: {
        token: sysConfig.puppetToken,
      },
    },
  }

  bot = WechatyBuilder.build(wechatyConfig[sysConfig.puppetName])

  async function onScan(qrcode: string, status: ScanStatus) {
    console.debug(qrcode)
    if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
      const qrcodeUrl = encodeURIComponent(qrcode)

      const qrcodeImageUrl = [
        'https://wechaty.js.org/qrcode/',
        qrcodeUrl,
      ].join('')
      log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)

      qrcodeTerminal.generate(qrcode, { small: true })  // show qrcode on console

      let uploadedAttachments = ''
      let file: FileBox
      let filePath = 'qrcode.png'
      try {
        file = FileBox.fromQRCode(qrcode)
        if (file) {
          filePath = './' + file.name
          try {
            const writeStream = fs.createWriteStream(filePath)
            await file.pipe(writeStream)
            await wait(200)
            const readerStream = fs.createReadStream(filePath)
            uploadedAttachments = await vika.upload(readerStream)
            const text = qrcodeImageUrl
            await vika.addScanRecord(uploadedAttachments, text)
            fs.unlink(filePath, (err) => {
              console.debug('上传vika完成删除文件：', filePath, err)
            })
          } catch {
            console.debug('上传失败：', filePath)
            fs.unlink(filePath, (err) => {
              console.debug('上传vika失败删除文件', filePath, err)
            })
          }
        }

      } catch (e) {
        console.log('vika 写入失败：', e)
      }

    } else {
      log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
    }
  }

  async function onLogin(user: Contact) {
    log.info('StarterBot', '%s login', user.payload)
    log.info(JSON.stringify(user.payload))
    if(sysConfig.mqttPassword){
      chatdev = new ChatDevice(sysConfig.mqttUsername, sysConfig.mqttPassword, sysConfig.mqttEndpoint, sysConfig.mqttPort,user.id)
      chatdev.init(bot)
    }
    const rooms = await bot.Room.findAll()
    console.debug('当前最新微信群数量：', rooms.length)
    updateRooms(rooms)
    const contacts = await bot.Contact.findAll()
    console.debug('当前微信最新联系人数量：', contacts.length)
    updateContacts(contacts)

    // 心跳5min发一次
    // const rule = new schedule.RecurrenceRule();
    // rule.second = 300;
    // const job = schedule.scheduleJob(rule, async function () {
    //   const curDate = '现在时间：' + new Date()
    //   console.log(curDate);
    //   const contact = await bot.Contact.find({ id: 'tyutluyc' })
    //   await contact.say(curDate)
    // });
    // log.info(job)
  }

  function onLogout(user: Contact) {
    log.info('StarterBot', '%s logout', user)
  }

  async function onMessage(message: Message) {

    log.info('onMessage', JSON.stringify(message))
    chatdev.pub_message(message)

    const talker = message.talker()
    const text = message.text()
    const room = message.room()
    const roomId = room?.id
    const topic = await room?.topic()

    try {
      const isSelfMsg = message.self()

      if (room && roomId && !isSelfMsg) {

        if (sysConfig.roomWhiteListOpen) {
          const isInRoomWhiteList = sysConfig.roomWhiteList.includes(roomId)
          if (isInRoomWhiteList) {
            log.info('当前群在白名单内，请求问答...')
            await wxai(sysConfig, bot, talker, room, message)
          } else {
            log.info('当前群不在白名单内，流程结束')
          }
        }

        if (!sysConfig.roomWhiteListOpen) {
          log.info('系统未开启白名单，请求问答...')
          await wxai(sysConfig, bot, talker, room, message)
        }

        // IM服务开启时执行
        if (sysConfig.imOpen && bot.Message.Type.Text === message.type()) {
          configData.clientChatEn.clientChatId = talker.id + ' ' + room.id
          configData.clientChatEn.clientChatName = talker.name() + '@' + topic
          // log.debug(configData)
          socket.emit('CLIENT_ON', {
            clientChatEn: configData.clientChatEn,
            serverChatId: configData.serverChatEn.serverChatId,
          })
          const data = {
            msg: {
              contentType: 'text',
              content: text,
              role: 'client',
              avatarUrl: '/static/image/im_server_avatar.png',
            },
          }
          log.info(JSON.stringify(data))
          sendMsg(data)
        }

      }

      if ((!room || !room.id) && !isSelfMsg) {
        await wxai(sysConfig, bot, talker, undefined, message)
      }

    } catch (e) {
      log.error('发起请求wxai失败', e)
    }

    // if (text == '我要转发') {
    //   await message.say('接收密码')
    // }

    // if (text == '我要接收') {
    //   await message.say('发送密码')
    // }

    // if (text == '发送密码to接收密码') {
    //   await message.say('发送密码')
    // }

  }

  async function roomJoin(room: { topic: () => any; id: any; say: (arg0: string, arg1: any) => any }, inviteeList: any[], inviter: any) {
    const nameList = inviteeList.map(c => c.name()).join(',')
    log.info(`Room ${await room.topic()} got new member ${nameList}, invited by ${inviter}`)
    if (sysConfig.welcomeList.includes(room.id)) {
      const newer = inviteeList[0]
      if (newer) {
        const newers: [Contact] = [newer]
        await room.say(`欢迎加入${await room.topic()},请阅读群公告~`, ...newers)
      }
    }
  }

  async function updateContacts(contacts: Contact[]) {
    const recordsAll: any = []
    const recordExisting = await vika.getAllRecords(vika.contactSheet)
    console.debug('云端好友数量：', recordExisting.length)
    const wxids: string[] = []
    if (recordExisting.length) {
      recordExisting.forEach((record: { fields: any, id: any }) => {
        wxids.push(record.fields.id)
      });
    }
    for (let i = 0; i < contacts.length; i++) {
      let item = contacts[i]
      if (item && item.friend() && !wxids.includes(item.id)) {
        const fields = {
          "id": item.id,
          "name": item.name(),
          "alias": String(await item.alias() || ''),
          "gender": String(item.gender() || ''),
          "friend": item.friend(),
          "type": String(item.type()),
          "avatar": String(await item.avatar()),
          "phone": String(await item.phone())
        }
        const record = {
          fields
        }
        recordsAll.push(record)
      }
    }

    for (let i = 0; i < recordsAll.length; i = i + 10) {
      const records = recordsAll.slice(i, i + 10)
      await vika.createRecord(vika.contactSheet, records)
      console.debug('好友列表同步中...', i + 10)
      void await wait(200)
    }

    console.debug('同步好友列表完成，更新好友数量：', recordsAll.length)

  }

  async function updateRooms(rooms: Room[]) {
    const recordsAll: any = []
    const recordExisting = await vika.getAllRecords(vika.roomListSheet)
    console.debug('云端群数量：', recordExisting.length)
    const wxids: string[] = []
    if (recordExisting.length) {
      recordExisting.forEach((record: { fields: any, id: any }) => {
        wxids.push(record.fields.id)
      });
    }
    for (let i = 0; i < rooms.length; i++) {
      let item = rooms[i]
      if (item && !wxids.includes(item.id)) {
        const fields = {
          "id": item.id,
          "topic": await item.topic() || '',
          "ownerId": String(item.owner()?.id || ''),
          "avatar": String(await item.avatar() || ''),
        }
        const record = {
          fields
        }
        recordsAll.push(record)
      }
    }

    for (let i = 0; i < recordsAll.length; i = i + 10) {
      const records = recordsAll.slice(i, i + 10)
      await vika.createRecord(vika.roomListSheet, records)
      console.debug('群列表同步中...', i + 10)
      void await wait(200)
    }

    console.debug('同步群列表完成，更新群数量：', recordsAll.length)

  }

  const missingConfiguration = []

  for (const key in configs) {
    if (!configs[key] && !['imOpen', 'DIFF_REPLY_ONOFF'].includes(key)) {
      missingConfiguration.push(key)
    }
  }

  if (missingConfiguration.length === 0) {

    const vikaConfig = { token: configs.VIKA_TOKEN, spaceName: configs.VIKA_SPACENAME }

    bot.use(
      WechatyVikaPlugin(vikaConfig),
    )
    bot.on('scan', onScan)
    bot.on('login', onLogin)
    bot.on('logout', onLogout)
    bot.on('message', onMessage)
    bot.on('room-join', roomJoin)

    bot.start()
      .then(() => log.info('Starter Bot Started.'))
      .catch((e: any) => log.error(JSON.stringify(e)))

    // try {
    //   bot.start()
    //     .then(() => log.info('Starter Bot Started.'))
    //     .catch((e: any) => log.error(JSON.stringify(e)))
    // } catch (e) {
    //   void await wait(1000)
    //   bot.start()
    //     .then(() => log.info('Starter Bot Started.'))
    //     .catch((e: any) => log.error(JSON.stringify(e)))
    // }

  } else {
    log.error('\n======================================\n\n', `错误提示：\n缺少${missingConfiguration.join()}配置参数,请检查config.js文件\n\n======================================`)
    log.info(configs)
  }

  let socket: any
  if (sysConfig.imOpen) {
    socket = io.connect('http://localhost:3001')
    configData.socket = socket
    socket.on('connect', () => {
      // 客户端上线
      socket.emit('CLIENT_ON', {
        clientChatEn: configData.clientChatEn,
        serverChatId: configData.serverChatEn.serverChatId,
      })

      // 服务端链接
      socket.on('SERVER_CONNECTED', (data: { serverChatEn: { serverChatId: string; serverChatName: string; avatarUrl: string } }) => {
        // 1)获取客服消息
        configData.serverChatEn = data.serverChatEn

        // 2)添加消息
        addChatMsg({
          role: 'sys',
          contentType: 'text',
          content: '客服 ' + configData.serverChatEn.serverChatName + ' 为你服务',
        }, () => { })
      })

      // 接受服务端信息
      socket.on('SERVER_SEND_MSG', async (data: any) => {
        log.info(data)
        // if (data.msg && data.msg.role == 'server') {
        //   data.msg.role = 'client'
        //   sendMsg(data)
        // }
        try {
          const roomId = data.msg.clientChatId.split(' ')[1]
          const contactId = data.msg.clientChatId.split(' ')[0]
          const room = await bot.Room.find({ id: roomId })
          const contact = await bot.Contact.find({ id: contactId })
          if (room) {
            await room.say(data.msg.content, ...[contact])
          }

          // configData.msg.avatarUrl = data.serverChatEn.avatarUrl;
        } catch (e) {
          log.error(JSON.stringify(e))
        }

      })
    })
  } else {
    socket = {}
  }

  /**
   * 添加chat对象的msg
   * @param {Object} msg 消息对象；eg：{role:'sys',content:'含有新的消息'}
   * @param {String} msg.role 消息所有者身份；eg：'sys'系统消息；
   * @param {String} msg.contentType 消息类型；text:文本(默认)；image:图片
   * @param {String} msg.content 消息内容
   * @param {Function} successCallback 添加消息后的回调
   */
  function addChatMsg(msg: { role: any; contentType: any; content?: string; createTime?: any }, successCallback: { (): void; (): any }) {
    // 1.设定默认值
    msg.role = msg.role == undefined ? 'sys' : msg.role
    msg.contentType = msg.contentType == undefined ? 'text' : msg.contentType
    msg.createTime = msg.createTime == undefined ? new Date() : msg.createTime

    // 2.插入消息
    // 1)插入日期
    // 实际场景中，在消息上方是否显示时间是由后台传递给前台的消息中附加上的，可参考 微信Web版
    // 此处进行手动设置，5分钟之内的消息，只显示一次消息
    msg.createTime = new Date(msg.createTime)
    // if (configData.chatInfoEn.lastMsgShowTime === null || msg.createTime.getTime() - configData.chatInfoEn.lastMsgShowTime.getTime() > 1000 * 60 * 5) {
    //   msgList.push({
    //     role: 'sys',
    //     contentType: 'text',
    //     content: '2022-5-30 20:00:00',
    //   })
    //   configData.chatInfoEn.lastMsgShowTime = msg.createTime
    // }

    // 2)插入消息
    // msgList.push(msg)

    // 3.设置chat对象相关属性
    // configData.chatInfoEn.msgList = msgList

    // 4.回调
    successCallback && successCallback()
  }

  /**
   * 发送消息
   * @param {Object} rs 回调对象
   */
  function sendMsg(rs: any) {
    const msg = rs.msg
    msg.role = 'client'
    msg.avatarUrl = configData.clientChatEn.avatarUrl
    if (configData.chatInfoEn.chatState == 'robot') {
      // 机器人发送接口
    } else if (configData.chatInfoEn.chatState == 'agent') {
      // 客服接口
      configData.socket.emit('CLIENT_SEND_MSG', {
        serverChatId: configData.serverChatEn.serverChatId,
        clientChatEn: configData.clientChatEn,
        msg: msg,
      })

      // log.debug(configData.serverChatEn.serverChatId)
    }
    // 2.添加到消息集合李
    //   addChatMsg(msg)
  }

}

// 定义一个延时方法
const wait = (ms: number | undefined) => new Promise(resolve => setTimeout(resolve, ms))

void main()
