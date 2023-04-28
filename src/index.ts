#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
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
} from 'wechaty'

import qrcodeTerminal from 'qrcode-terminal'
import { FileBox } from 'file-box'
import {
  VikaBot,
  configData,
  sendMsg,
  imclient,
  wxai,
  ChatDevice,
  propertyMessage,
  eventMessage,

} from './plugins/index.js'
import { configs, config } from './config.js'
import {
  waitForMs as wait,
  formatSentMessage,
} from './util/tool.js'
import schedule from 'node-schedule'
import { db } from './db/tables.js'

log.info('db:', db)
log.info('config:', JSON.stringify(config))
// log.info('process.env', JSON.stringify(process.env))

let bot: Wechaty
let sysConfig: any
let chatdev: any = {}
let job: any
let jobs: any
let vika: any
let socket: any = {}

configs['VIKA_TOKEN'] = configs['VIKA_TOKEN'] || process.env['VIKA_TOKEN'] || ''
configs['VIKA_SPACENAME'] = configs['VIKA_SPACENAME'] || process.env['VIKA_SPACENAME'] || ''

// log.info(configs)

const vikaConfig = {
  spaceName: configs['VIKA_SPACENAME'],
  token: configs['VIKA_TOKEN'],
}
// log.info(vikaConfig)

// function add2sentMessage (record: any) {
//   db.message.insert(record, (err: any, newDoc: any) => {
//     if (err) {
//       log.error('db.message.insert', err)
//     } else {
//       log.info('db.message.insert', newDoc)
//     }
//   })
// }

function getBot (sysConfig: any) {
  const ops:any = {
    name: 'qa-bot',
    puppet: sysConfig.puppetName,
    puppetOptions: {
      token: sysConfig.puppetToken || 'null',
    },
  }

  log.info(ops)

  if (sysConfig.puppetName === 'wechaty-puppet-service') {
    process.env['WECHATY_PUPPET_SERVICE_NO_TLS_INSECURE_CLIENT'] = 'true'
  }

  if (sysConfig.puppetName === 'wechaty-puppet-wechat4u' || sysConfig.puppetName === 'wechaty-puppet-xp' || sysConfig.puppetName === 'wechaty-puppet-engine') {
    delete ops.puppetOptions.token
  }

  if (sysConfig.puppetName === 'wechaty-puppet-wechat') {
    delete ops.puppetOptions.token
    ops.puppetOptions.uos = true
  }

  log.info('bot ops:', JSON.stringify(getBot))

  const bot = WechatyBuilder.build(ops)
  return bot
}

function checkConfig (configs: { [key: string]: any }) {
  const missingConfiguration = []

  for (const key in configs) {
    if (!configs[key] && ![ 'imOpen', 'DIFF_REPLY_ONOFF' ].includes(key)) {
      missingConfiguration.push(key)
    }
  }

  if (missingConfiguration.length > 0) {
    log.error('\n======================================\n\n', `错误提示：\n缺少${missingConfiguration.join()}配置参数,请检查config.js文件\n\n======================================`)
    log.info('bot configs:', configs)
    return false
  }
  return true
}

async function updateJobs (bot: Wechaty, vika:any) {
  try {
    const tasks = await vika.getTimedTask()
    schedule.gracefulShutdown()
    jobs = {}
    // log.info(tasks)
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
        log.info(curRule)

        try {
          schedule.scheduleJob(task.id, curRule, async () => {
            try {
              const curDate = new Date()
              log.info('定时任务：', curTimeF, curRule, curDate, JSON.stringify(task))
              // await user.say('心跳：' + curDate)

              try {
                if (task.contacts.length) {
                  const contact = await bot.Contact.find({ id: task.contacts[0] })
                  if (contact) {
                    await contact.say(task.msg)
                    vika.addRecord(await formatSentMessage(bot.currentUser, task.msg, contact, undefined))
                    await wait(200)
                  }
                }
              } catch (e) {
                log.error('发送好友定时任务失败:', e)
              }

              try {
                if (task.rooms.length) {
                  const room = await bot.Room.find({ id: task.rooms[0] })
                  if (room) {
                    await room.say(task.msg)
                    vika.addRecord(await formatSentMessage(bot.currentUser, task.msg, undefined, room))
                    await wait(200)
                  }
                }
              } catch (e) {
                log.error('发送群定时任务失败:', e)

              }

            } catch (err) {
              log.error('定时任务执行失败：', err)
            }
          })
          jobs[task.id] = task
        } catch (e) {
          log.error('创建定时任务失败:', e)
        }
      }
    }
    log.info('通知提醒任务初始化完成，创建任务数量：', Object.keys(jobs).length)

  } catch (err: any) {
    log.error('更新通知提醒列表任务失败：', err)
  }
}

async function onScan (qrcode: string, status: ScanStatus) {
  await vika.onScan(qrcode, status)
  log.info(qrcode)
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
          log.info('上传vika完成删除文件：', filePath, err)
        })
      } catch {
        log.info('上传失败：', filePath)
        fs.unlink(filePath, (err) => {
          log.info('上传vika失败删除文件', filePath, err)
        })
      }

    } catch (e) {
      log.info('vika 写入失败：', e)
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
    const rooms: Room[] = await bot.Room.findAll()
    await vika.updateRooms(rooms)
    const contacts: Contact[] = await bot.Contact.findAll()
    await vika.updateContacts(contacts)
  } catch (err) {
    log.error('更新好友和群列表失败：', err)
  }

  // // 启动心跳，5min发一次
  // const rule = new schedule.RecurrenceRule();
  // rule.second = 0;
  // rule.minute = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  // job = schedule.scheduleJob(rule, async function () {
  //   try {
  //     // const contact = await bot.Contact.find({ id: 'tyutluyc' })
  //     log.info(curDate);
  //     // await user.say('心跳：' + curDate)
  //     await vika.addHeartbeatRecord('心跳：' + curDate)
  //     if (chatdev && sysConfig.mqtt_PUB_ONOFF) {
  //       chatdev.pub_property(propertyMessage('lastActive', curDate))
  //     }
  //   } catch (err) {
  //     log.error(err)
  //   }
  // });
  // log.info('下一次心跳调用时间：', job.nextInvocation())

  // 启动心跳，5min发一次
  setInterval(() => {
    try {
      // const contact = await bot.Contact.find({ id: 'tyutluyc' })
      log.info(curDate)
      // await user.say('心跳：' + curDate)
      // vika.addHeartbeatRecord('心跳：' + curDate)
      if (chatdev && sysConfig.mqtt_PUB_ONOFF) {
        chatdev.pub_property(propertyMessage('lastActive', curDate))
      }
    } catch (err) {
      log.error('发送心跳失败：', err)
    }
  }, 300000)

  await updateJobs(bot, vika)
  log.info('================================================\n\n登录启动成功，程序准备就绪\n\n================================================\n')
}

async function onReady () {
  log.info('StarterBot is ready')
  const curDate = new Date().toLocaleString()
  if (sysConfig.mqttPassword && (sysConfig.mqtt_SUB_ONOFF || sysConfig.mqtt_PUB_ONOFF)) {
    chatdev = new ChatDevice(sysConfig.mqttUsername, sysConfig.mqttPassword, sysConfig.mqttEndpoint, sysConfig.mqttPort, bot.currentUser.id)
    if (sysConfig.mqtt_SUB_ONOFF) {
      chatdev.init(bot)
    }
  }

  try {
    // await user.say('上线：' + curDate)
    // 更新云端好友和群
    const rooms: Room[] = await bot.Room.findAll()
    await vika.updateRooms(rooms)
    const contacts: Contact[] = await bot.Contact.findAll()
    await vika.updateContacts(contacts)

  } catch (err) {
    log.error('更新群和好友列表失败：', err)
  }

  // // 启动心跳，5min发一次
  // const rule = new schedule.RecurrenceRule();
  // rule.second = 0;
  // rule.minute = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  // job = schedule.scheduleJob(rule, async function () {
  //   try {
  //     // const contact = await bot.Contact.find({ id: 'tyutluyc' })
  //     log.info(curDate);
  //     // await user.say('心跳：' + curDate)
  //     await vika.addHeartbeatRecord('心跳：' + curDate)
  //     if (chatdev && sysConfig.mqtt_PUB_ONOFF) {
  //       chatdev.pub_property(propertyMessage('lastActive', curDate))
  //     }
  //   } catch (err) {
  //     log.error('心跳发送失败：', err)
  //   }
  // });
  // log.info('下一次心跳调用时间：', job.nextInvocation())

  // 启动心跳，5min发一次
  setInterval(() => {
    try {
      // const contact = await bot.Contact.find({ id: 'tyutluyc' })
      log.info(curDate)
      // await user.say('心跳：' + curDate)
      // vika.addHeartbeatRecord('心跳：' + curDate)
      if (chatdev && sysConfig.mqtt_PUB_ONOFF) {
        chatdev.pub_property(propertyMessage('lastActive', curDate))
      }
    } catch (err) {
      log.error('发送心跳失败：', err)
    }
  }, 300000)

  await updateJobs(bot, vika)
  log.info('================================================\n\n登录启动成功，程序准备就绪\n\n================================================\n')
}

function onLogout (user: Contact) {
  log.info('StarterBot', '%s logout', user)
  job.cancel()
}

async function onMessage (message: Message) {
  // log.info('onMessage', JSON.stringify(message))
  await vika.onMessage(message)
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

  log.info('keyWord is:', keyWord)

  if (isSelfMsg && (text === '#指令列表' || text === '#帮助')) {
    text = '操作指令说明：\n\n#更新配置 更新全部配置\n#更新提醒 更新定时提醒任务\n'
    await message.say(text)
  }

  if (isSelfMsg && (text === '#更新配置' || text === '#更新')) {
    log.info('热更新系统配置~')
    let text = ''
    try {
      sysConfig = await vika.getConfig()
      // message.say('配置更新成功：' + JSON.stringify(newConfig))
      log.info('newConfig', sysConfig)
      text = keyWord + '，配置更新成功~'
    } catch (e) {
      text = keyWord + '，配置更新成功~'
    }
    await message.say(text)
    vika.addRecord(await formatSentMessage(bot.currentUser, text, message.room() ? undefined : message.talker(), message.room()))
  }

  if (isSelfMsg && text === '#更新提醒') {
    log.info('热更新通知任务~')
    try {
      await updateJobs(bot, vika)
      text = keyWord + '，提醒任务更新成功~'
    } catch (e) {
      text = keyWord + '，提醒任务更新失败~'
    }
    await message.say(text)
    vika.addRecord(await formatSentMessage(bot.currentUser, text, message.room() ? undefined : message.talker(), message.room()))
  }

  try {

    if (room && roomId && !isSelfMsg) {

      // 智能问答开启时执行
      if (sysConfig.WX_OPENAI_ONOFF && ((text.indexOf(keyWord) !== -1 && sysConfig.AT_AHEAD) || !sysConfig.AT_AHEAD)) {
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
            avatarUrl: '/static/image/im_server_avatar.png',
            content: text,
            contentType: 'text',
            role: 'client',
          },
        }
        log.info(JSON.stringify(data))
        sendMsg(data)
      }

    }

    if ((!room || !room.id) && !isSelfMsg) {
      // 智能问答开启时执行
      if (sysConfig.WX_OPENAI_ONOFF && ((text.indexOf(keyWord) !== -1 && sysConfig.AT_AHEAD) || !sysConfig.AT_AHEAD)) {
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

async function onError (err:any) {
  log.error('bot.onError:', JSON.stringify(err))
  try {
    job.cancel()
  } catch (e) {
    log.error('销毁定时任务失败：', JSON.stringify(e))
  }
}

async function main (vika:any) {
  // 初始化获取配置信息
  const initReady = await vika.checkInit('主程序载入系统配置成功，等待插件初始化...')
  if (!initReady) {
    return
  }

  // 获取系统配置信息
  sysConfig = await vika.getConfig()
  config.botConfig.bot = sysConfig
  const configReady = checkConfig(configs)

  // 配置齐全，启动机器人
  if (configReady) {
    bot = getBot(sysConfig)
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
    bot.on('error', onError)

    bot.start()
      .then(() => log.info('Starter Bot Started.'))
      .catch((e: any) => log.error('bot运行异常：', JSON.stringify(e)))

    if (sysConfig.imOpen) {
      socket = imclient(bot, vika, configData)
    }
  }
}

// 检查维格表配置并启动
if (vikaConfig.spaceName && vikaConfig.token) {
  vika = new VikaBot(vikaConfig)
  void main(vika)
} else {
  log.error('vikaConfig配置错误，请检查config.ts文件')
}
