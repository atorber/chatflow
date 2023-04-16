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
  Message,
  ScanStatus,
  log,
  Room,
  types,
  Wechaty,
  WechatyBuilder,
  // types,
} from 'wechaty'
// import * as PUPPET from 'wechaty-puppet'

import qrcodeTerminal from 'qrcode-terminal'

// import WechatyVikaPlugin from 'wechaty-vika-link'
import WechatyVikaPlugin from './plugins/index.js'

import { FileBox } from 'file-box'
import configs from './config.js'
// import type { Puppet } from 'wechaty-puppet'
import * as io from 'socket.io-client'
import { VikaBot } from './plugins/vika.js'
import { configData } from './plugins/im.js'
import { wxai } from './plugins/wxai.js'

import { ChatDevice } from './plugins/chat-device.js'
import { propertyMessage, eventMessage } from './plugins/msg-format.js'
import {
  waitForMs as wait,
  storeSentMessage,
} from './util/tool.js'

import schedule from 'node-schedule'

globalThis.sentMessage = []

function add2sentMessage (record:any) {
  globalThis.sentMessage.push(record)
}

let bot: Wechaty
let sysConfig: any
let chatdev: any = {}
let job: any
let jobs: any

if (!configs.VIKA_TOKEN && process.env['VIKA_TOKEN']) {
  configs.VIKA_TOKEN = process.env['VIKA_TOKEN']
}

if (!configs.VIKA_SPACENAME && process.env['VIKA_SPACENAME']) {
  configs.VIKA_SPACENAME = process.env['VIKA_SPACENAME']
}

// console.debug(configs)

const vikaConfig = {
  spaceName: configs.VIKA_SPACENAME,
  token: configs.VIKA_TOKEN,
}
// console.debug(vikaConfig)
const vika = new VikaBot(vikaConfig)

async function getConfig (vika: any) {
  sysConfig = await vika.getConfig()
  console.debug(JSON.stringify(sysConfig))
  return sysConfig
}

async function main () {
  const isReady = await vika.checkInit('主程序载入系统配置成功，等待插件初始化...')

  if (!isReady) {
    return
  }

  // 获取系统配置信息
  await getConfig(vika)
  const ops = {
    name: 'openai-qa-bot',
    puppet: sysConfig.puppetName,
    puppetOptions: {
      token: sysConfig.puppetToken || 'null',
      uos: true,
    },
  }

  // console.debug(ops)

  if (sysConfig.puppetName === 'wechaty-puppet-service') {
    process.env['WECHATY_PUPPET_SERVICE_NO_TLS_INSECURE_CLIENT'] = 'true'
  }

  if (sysConfig.puppetName === 'wechaty-puppet-wechat' || sysConfig.puppetName == 'wechaty-puppet-wechat4u' || sysConfig.puppetName == 'wechaty-puppet-xp' || sysConfig.puppetName == 'wechaty-puppet-engine') {
    delete ops.puppetOptions.token
  }

  if (sysConfig.puppetName !== 'wechaty-puppet-wechat') {
    delete (ops.puppetOptions as any).uos
  }

  // console.debug(process.env['WECHATY_PUPPET_SERVICE_NO_TLS_INSECURE_CLIENT'])

  bot = WechatyBuilder.build(ops)

  async function onScan (qrcode: string, status: ScanStatus) {
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

  async function onLogin (user: Contact) {
    log.info('StarterBot', '%s login', user.payload)
    const curDate = new Date().toLocaleString()
    log.info(JSON.stringify(user.payload))
    if (sysConfig.mqttPassword && (sysConfig.mqtt_SUB_ONOFF || sysConfig.mqtt_PUB_ONOFF)) {
      chatdev = new ChatDevice(sysConfig.mqttUsername, sysConfig.mqttPassword, sysConfig.mqttEndpoint, sysConfig.mqttPort, user.id)
      if (sysConfig.mqtt_SUB_ONOFF) {
        chatdev.init(bot)
      }
    }

    try {
      await user.say('上线：' + curDate)
      // 更新云端好友和群
      await updateRooms(bot)
      await updateContacts(bot)

    } catch (err) {
      console.error(err)
    }

    // // 启动心跳，5min发一次
    // const rule = new schedule.RecurrenceRule();
    // rule.second = 0;
    // rule.minute = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    // job = schedule.scheduleJob(rule, async function () {
    //   try {
    //     // const contact = await bot.Contact.find({ id: 'tyutluyc' })
    //     console.log(curDate);
    //     // await user.say('心跳：' + curDate)
    //     await vika.addHeartbeatRecord('心跳：' + curDate)
    //     if (chatdev && sysConfig.mqtt_PUB_ONOFF) {
    //       chatdev.pub_property(propertyMessage('lastActive', curDate))
    //     }
    //   } catch (err) {
    //     console.error(err)
    //   }
    // });
    // log.info('下一次心跳调用时间：', job.nextInvocation())

    // 启动心跳，5min发一次
    setInterval(() => {
      try {
        // const contact = await bot.Contact.find({ id: 'tyutluyc' })
        console.log(curDate)
        // await user.say('心跳：' + curDate)
        // vika.addHeartbeatRecord('心跳：' + curDate)
        if (chatdev && sysConfig.mqtt_PUB_ONOFF) {
          chatdev.pub_property(propertyMessage('lastActive', curDate))
        }
      } catch (err) {
        console.error(err)
      }
    }, 300000)

    await updateJobs(bot)
    console.log('================================================\n\n登录启动成功，程序准备就绪\n\n================================================\n')
  }

  async function onReady () {
    log.info('StarterBot is ready')
    const curDate = new Date().toLocaleString()
    if (sysConfig.mqttPassword && (sysConfig.mqtt_SUB_ONOFF || sysConfig.mqtt_PUB_ONOFF)) {
      chatdev = new ChatDevice(sysConfig.mqttUsername, sysConfig.mqttPassword, sysConfig.mqttEndpoint, sysConfig.mqttPort, (this as Wechaty).id)
      if (sysConfig.mqtt_SUB_ONOFF) {
        chatdev.init(bot)
      }
    }

    try {
      // await user.say('上线：' + curDate)
      // 更新云端好友和群
      await updateRooms(bot)
      await updateContacts(bot)

    } catch (err) {
      console.error(err)
    }

    // // 启动心跳，5min发一次
    // const rule = new schedule.RecurrenceRule();
    // rule.second = 0;
    // rule.minute = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    // job = schedule.scheduleJob(rule, async function () {
    //   try {
    //     // const contact = await bot.Contact.find({ id: 'tyutluyc' })
    //     console.log(curDate);
    //     // await user.say('心跳：' + curDate)
    //     await vika.addHeartbeatRecord('心跳：' + curDate)
    //     if (chatdev && sysConfig.mqtt_PUB_ONOFF) {
    //       chatdev.pub_property(propertyMessage('lastActive', curDate))
    //     }
    //   } catch (err) {
    //     console.error(err)
    //   }
    // });
    // log.info('下一次心跳调用时间：', job.nextInvocation())

    // 启动心跳，5min发一次
    setInterval(() => {
      try {
        // const contact = await bot.Contact.find({ id: 'tyutluyc' })
        console.log(curDate)
        // await user.say('心跳：' + curDate)
        // vika.addHeartbeatRecord('心跳：' + curDate)
        if (chatdev && sysConfig.mqtt_PUB_ONOFF) {
          chatdev.pub_property(propertyMessage('lastActive', curDate))
        }
      } catch (err) {
        console.error(err)
      }
    }, 300000)

    await updateJobs(bot)
    console.log('================================================\n\n登录启动成功，程序准备就绪\n\n================================================\n')
  }

  function onLogout (user: Contact) {
    log.info('StarterBot', '%s logout', user)
    job.cancel()
  }

  async function onMessage (message: Message) {

    log.info('onMessage', JSON.stringify(message))
    console.debug('onMessage', JSON.stringify(message))
    const curDate = new Date().toLocaleString()
    if (chatdev && sysConfig.mqtt_PUB_ONOFF) {
      /*
      将消息通过mqtt通道上报到云端
      */
      // chatdev.pub_message(message)
      chatdev.pub_event(eventMessage('onMessage', { curDate }))

    }

    const talker = message.talker()
    let text = message.text()
    const room = message.room()
    const roomId = room?.id
    const topic = await room?.topic()
    const keyWord = bot.currentUser.name()
    const isSelfMsg = message.self()

    console.debug('keyWord is:', keyWord)

    if (isSelfMsg && text === '#更新配置') {
      console.debug('热更新系统配置~')
      let text = ''
      try {
        const newConfig = await getConfig(vika)
        // message.say('配置更新成功：' + JSON.stringify(newConfig))
        console.debug(newConfig)
        text = keyWord + '，配置更新成功~'
      } catch (e) {
        text = keyWord + '，配置更新成功~'
      }
      await message.say(text)
      add2sentMessage(storeSentMessage(bot.currentUser, text, message.room() ? undefined : message.talker(), message.room()))
    }

    if (isSelfMsg && text === '#更新提醒') {
      console.debug('热更新通知任务~')
      try {
        await updateJobs(bot)
        text = keyWord + '，提醒任务更新成功~'
      } catch (e) {
        text = keyWord + '，提醒任务更新失败~'
      }
      await message.say(text)
      add2sentMessage(storeSentMessage(bot.currentUser, text, message.room() ? undefined : message.talker(), message.room()))
    }

    try {

      if (room && roomId && !isSelfMsg) {

        // 智能问答开启时执行
        if (sysConfig.WX_OPENAI_ONOFF && ((text.indexOf(keyWord) != -1 && sysConfig.AT_AHEAD) || !sysConfig.AT_AHEAD)) {
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
        }

        // IM服务开启时执行
        if (sysConfig.imOpen && types.Message.Text === message.type()) {
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
        // 智能问答开启时执行
        if (sysConfig.WX_OPENAI_ONOFF && ((text.indexOf(keyWord) != -1 && sysConfig.AT_AHEAD) || !sysConfig.AT_AHEAD)) {
          if (sysConfig.contactWhiteListOpen) {
            const isInContactWhiteList = sysConfig.contactWhiteList.includes(talker.id)
            if (isInContactWhiteList) {
              log.info('当前好友在白名单内，请求问答...')
              await wxai(sysConfig, bot, talker, undefined, message)
            } else {
              log.info('当前好友不在白名单内，流程结束')
            }
          }

          if (!sysConfig.contactWhiteListOpen) {
            log.info('系统未开启好友白名单,对所有好友有效，请求问答...')
            await wxai(sysConfig, bot, talker, undefined, message)
          }
        }
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

  async function roomJoin (room: { topic: () => any; id: any; say: (arg0: string, arg1: any) => any }, inviteeList: any[], inviter: any) {
    const nameList = inviteeList.map(c => c.name()).join(',')
    log.info(`Room ${await room.topic()} got new member ${nameList}, invited by ${inviter}`)
    // if (sysConfig.welcomeList.includes(room.id)) {
    //   const newer = inviteeList[0]
    //   if (newer) {
    //     const newers: [Contact] = [newer]
    //     await room.say(`欢迎加入${await room.topic()},请阅读群公告~`, ...newers)
    //   }
    // }
  }

  async function updateContacts (bot: Wechaty) {
    const contacts: Contact[] = await bot.Contact.findAll()
    console.debug('当前微信最新联系人数量：', contacts.length)
    const recordsAll: any = []
    const recordExisting = await vika.getAllRecords(vika.contactSheet)
    console.debug('云端好友数量：', recordExisting.length)
    const wxids: string[] = []
    if (recordExisting.length) {
      recordExisting.forEach((record: { fields: any, id: any }) => {
        wxids.push(record.fields.id)
      })
    }
    for (let i = 0; i < contacts.length; i++) {
      const item = contacts[i]
      if (item && item.friend() && !wxids.includes(item.id)) {
        let avatar = ''
        try {
          avatar = String(await item.avatar())
        } catch (err) {

        }
        const fields = {
          id: item.id,
          name: item.name(),
          alias: String(await item.alias() || ''),
          gender: String(item.gender() || ''),
          friend: item.friend(),
          type: String(item.type()),
          avatar,
          phone: String(await item.phone()),
        }
        const record = {
          fields,
        }
        recordsAll.push(record)
      }
    }

    for (let i = 0; i < recordsAll.length; i = i + 10) {
      const records = recordsAll.slice(i, i + 10)
      await vika.createRecord(vika.contactSheet, records)
      console.debug('好友列表同步中...', i + 10)
      void await wait(250)
    }

    console.debug('同步好友列表完成，更新好友数量：', recordsAll.length)

  }

  async function updateRooms (bot: Wechaty) {
    const rooms: Room[] = await bot.Room.findAll()
    console.debug('当前最新微信群数量：', rooms.length)
    const recordsAll: any = []
    const recordExisting = await vika.getAllRecords(vika.roomListSheet)
    console.debug('云端群数量：', recordExisting.length)
    const wxids: string[] = []
    if (recordExisting.length) {
      recordExisting.forEach((record: { fields: any, id: any }) => {
        wxids.push(record.fields.id)
      })
    }
    for (let i = 0; i < rooms.length; i++) {
      const item = rooms[i]
      if (item && !wxids.includes(item.id)) {
        let avatar:any = 'null'
        try {
          avatar = String(await item.avatar())
        } catch (err) {
          console.error(err)
        }
        const fields = {
          id: item.id,
          topic: await item.topic() || '',
          ownerId: String(item.owner()?.id || ''),
          avatar,
        }
        const record = {
          fields,
        }
        recordsAll.push(record)
      }
    }

    for (let i = 0; i < recordsAll.length; i = i + 10) {
      const records = recordsAll.slice(i, i + 10)
      await vika.createRecord(vika.roomListSheet, records)
      console.debug('群列表同步中...', i + 10)
      void await wait(250)
    }

    console.debug('同步群列表完成，更新群数量：', recordsAll.length)

  }

  async function updateJobs (bot: Wechaty) {
    try {
      const tasks = await vika.getTimedTask()
      schedule.gracefulShutdown()
      jobs = {}
      // console.debug(tasks)
      for (let i = 0; i < tasks.length; i++) {
        const task: any = tasks[i]
        if (task.active) {
          const curTimeF = new Date(task.time)
          // const curTimeF = new Date(task.time+8*60*60*1000)
          let curRule = '* * * * * *'
          let dayOfWeek: any = '*'
          let month: any = '*'
          let dayOfMonth: any = '*'
          let hour: any = curTimeF.getHours()
          let minute: any = curTimeF.getMinutes()
          const second = 0
          const addMonth = []
          switch (task.cycle) {
            case '每季度':
              month = curTimeF.getMonth()
              for (let i = 0; i < 4; i++) {
                if (month + 3 <= 11) {
                  addMonth.push(month)
                } else {
                  addMonth.push(month - 9)
                }
                month = month + 3
              }
              month = addMonth
              break
            case '每天':
              break
            case '每周':
              dayOfWeek = curTimeF.getDay()
              break
            case '每月':
              month = curTimeF.getMonth()
              break
            case '每小时':
              hour = '*'
              break
            case '每30分钟':
              hour = '*'
              minute = [ 0, 30 ]
              break
            case '每15分钟':
              hour = '*'
              minute = [ 0, 15, 30, 45 ]
              break
            case '每10分钟':
              hour = '*'
              minute = [ 0, 10, 20, 30, 40, 50 ]
              break
            case '每5分钟':
              hour = '*'
              minute = [ 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55 ]
              break
            case '每分钟':
              hour = '*'
              minute = '*'
              break
            default:
              month = curTimeF.getMonth()
              dayOfMonth = curTimeF.getDate()
              break

          }
          curRule = `${second} ${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`
          console.debug(curRule)

          try {
            schedule.scheduleJob(task.id, curRule, async () => {
              try {
                const curDate = new Date()
                console.debug('定时任务：', curTimeF, curRule, curDate, JSON.stringify(task))
                // await user.say('心跳：' + curDate)

                try {
                  if (task.contacts.length) {
                    const contact = await bot.Contact.find({ id: task.contacts[0] })
                    if (contact) {
                      await contact.say(task.msg)
                      add2sentMessage(storeSentMessage(bot.currentUser, task.msg, contact, undefined))
                      await wait(200)
                    }
                  }
                } catch (e) {
                  console.error('发送好友定时任务失败:', e)

                }

                try {
                  if (task.rooms.length) {
                    const room = await bot.Room.find({ id: task.rooms[0] })
                    if (room) {
                      await room.say(task.msg)

                      add2sentMessage(storeSentMessage(bot.currentUser, task.msg, undefined, room))

                      await wait(200)
                    }
                  }
                } catch (e) {
                  console.error('发送群定时任务失败:', e)

                }

              } catch (err) {
                console.error(err)
              }
            })
            jobs[task.id] = task
          } catch (e) {
            console.error('创建定时任务失败:', e)
          }
        }
      }
      console.debug('通知提醒任务初始化完成，创建任务数量：', Object.keys(jobs).length)

    } catch (err: any) {
      log.error('更新通知提醒列表任务失败：', err)
    }
  }

  const missingConfiguration = []

  for (const key in configs) {
    if (!configs[key] && ![ 'imOpen', 'DIFF_REPLY_ONOFF' ].includes(key)) {
      missingConfiguration.push(key)
    }
  }

  if (missingConfiguration.length === 0) {
    bot.use(
      WechatyVikaPlugin(vika),
    )
    bot.on('scan', onScan)

    if (sysConfig.puppetName === 'wechaty-puppet-xp') {
      bot.on('login', onLogin)
    }
    if (sysConfig.puppetName !== 'wechaty-puppet-xp') {
      bot.on('ready', onReady)
    }

    bot.on('logout', onLogout)
    bot.on('message', onMessage)
    bot.on('room-join', roomJoin)
    bot.on('error', (err) => {
      log.error(JSON.stringify(err))
      try {
        job.cancel()
      } catch (e) {
        log.error(JSON.stringify(e))
      }

    })

    bot.start()
      .then(() => log.info('Starter Bot Started.'))
      .catch((e: any) => log.error(JSON.stringify(e)))

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
            await room.say(data.msg.content, ...[ contact ])
            add2sentMessage(storeSentMessage(bot.currentUser, data.msg.content, undefined, room))
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
  function addChatMsg (msg: { role: any; contentType: any; content?: string; createTime?: any }, successCallback: { (): void; (): any }) {
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
  function sendMsg (rs: any) {
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
        msg,
      })

      // log.debug(configData.serverChatEn.serverChatId)
    }
    // 2.添加到消息集合李
    //   addChatMsg(msg)
  }

}

void main()
