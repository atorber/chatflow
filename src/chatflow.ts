#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/* eslint-disable sort-keys */
import 'dotenv/config.js'
// import fs from 'fs'
import {
  Contact,
  Message,
  ScanStatus,
  WechatyPlugin,
  log,
  // types,
  Sayable,
  Wechaty,
  Room,
} from 'wechaty'

import qrcodeTerminal from 'qrcode-terminal'
import { FileBox } from 'file-box'
import fs from 'fs'
import {
  VikaBot,
  sendNotice,
  // getFormattedRideInfo,
  wxai,
  ChatDevice,
  propertyMessage,
  eventMessage,
  exportContactsAndRoomsToCSV,
  exportContactsAndRoomsToXLSX,
  getContact,
  getRoom,
  TaskConfig,
  // DateBase,
  type BusinessRoom,
  type BusinessUser,
} from './plugins/mod.js'
import type { configTypes } from './types/mod.js'

import { config } from './services/configService.js'

import {
  waitForMs as wait,
  getNow,
  getRule,
  generateRandomNumber,
} from './utils/utils.js'
import schedule from 'node-schedule'

import { addMessage } from './api/message.js'
import { containsContact, containsRoom } from './services/userService.js'
import { activityController } from './services/activityService.js'

log.info('初始化配置文件信息:\n', JSON.stringify(config), '================')

// log.info('process.env', JSON.stringify(process.env))

let chatdev: any = {}
let jobs: any
let vika: any
let isVikaOk: boolean = false

// 消息发布器
export const sendMsg = async (publisher: Message | Room | Contact, sayable: Sayable, inviteeList?: Contact[]) => {
  try {
    let replyMessage: Message | void
    if (inviteeList?.length) {
      const text = sayable as string
      replyMessage = await (publisher as Room).say(text, ...inviteeList)
    } else {
      replyMessage = await publisher.say(sayable)
    }
    if (isVikaOk && replyMessage) {
      await vika.onMessage(replyMessage)
    }
  } catch (e) {
    log.error('消息发送失败:', publisher, sayable, e)
  }
}

// 从维格表下载配置
export async function getCloudConfig () {
  const newConfig = await vika.downConfigFromVika()
  config.botConfig = newConfig.botConfig
  config.welcomeList = newConfig.welcomeList
}

// 从维格表下载白名单
export async function getWhiteList () {
  const whiteList = await vika.getWhiteList()
  config.contactWhiteList = whiteList.contactWhiteList
  config.roomWhiteList = whiteList.roomWhiteList
  log.info('获取到配置文件：', JSON.stringify(config))
}

export async function pubGroupNotifications (bot: Wechaty) {
  const groupNotifications = await vika.getGroupNotifications()
  const resPub: any[] = []
  const failRoom: any[] = []
  const failContact: any[] = []
  const successRoom: any[] = []
  const successContact: any[] = []

  for (const notice of groupNotifications) {
    const timestamp = new Date().getTime()
    // log.info('当前消息：', JSON.stringify(notice))
    if (notice.type === 'room') {
      const room = await getRoom(bot, notice.room)
      if (room) {
        try {
          await sendMsg(room, notice.text)
          await wait(generateRandomNumber(200))
          resPub.push({
            recordId: notice.recordId,
            fields: {
              // '昵称/群名称|name':await room.topic(),
              // '好友ID/群ID|id':room.id,
              '状态|state': '发送成功|success',
              '发送时间|pubTime': timestamp,
            },
          })
          successRoom.push(notice)
          log.info('发送成功：群-', await room.topic())
        } catch (e) {
          resPub.push({
            recordId: notice.recordId,
            fields: {
              '状态|state': '发送失败|fail',
              '发送时间|pubTime': timestamp,
              '信息|info':JSON.stringify(e),
            },
          })
          failRoom.push(notice)
          log.error('发送失败：', e)
        }
      } else {
        resPub.push({
          recordId: notice.recordId,
          fields: {
            '状态|state': '发送失败|fail',
            '发送时间|pubTime': timestamp,
            '信息|info':'群不存在',
          },
        })
        failRoom.push(notice)
        log.error('发送失败：群不存在', JSON.stringify(notice))
      }
    } else {
      const contact = await getContact(bot, notice.contact)
      if (contact) {
        try {
          await sendMsg(contact, notice.text)
          await wait(generateRandomNumber(200))
          resPub.push({
            recordId: notice.recordId,
            fields: {
              // '昵称/群名称|name':contact.name,
              // '好友ID/群ID|id':contact.id,
              // '好友备注|alias':await contact.alias(),
              '状态|state': '发送成功|success',
              '发送时间|pubTime': timestamp,
            },
          })
          successContact.push(notice)
          log.info('发送成功：好友-', contact.name())
        } catch (e) {
          resPub.push({
            recordId: notice.recordId,
            fields: {
              '状态|state': '发送失败|fail',
              '发送时间|pubTime': timestamp,
              '信息|info':JSON.stringify(e),
            },
          })
          failContact.push(notice)
          log.error('发送失败：', e)
        }
      } else {
        resPub.push({
          recordId: notice.recordId,
          fields: {
            '状态|state': '发送失败|fail',
            '发送时间|pubTime': timestamp,
            '信息|info':'好友不存在',
          },
        })
        failContact.push(notice)
        log.error('发送失败：好友不存在', JSON.stringify(notice))
      }
    }
  }
  for (let i = 0; i < resPub.length; i = i + 10) {
    const records = resPub.slice(i, i + 10)
    await vika.updateRecord(vika.dataBaseIds.groupNotificationsSheet, records)
    log.info('群发消息同步中...', i + 10)
    void await wait(1000)
  }

  return `发送成功:群${successRoom.length},好友${successContact.length}\n发送失败：群${failRoom.length},好友${failContact.length}`
}

// 保存配置文件到data/config.json
export function updateConfig (config: any) {
  fs.writeFileSync('data/config.json', JSON.stringify(config, null, '\t'))
}

// 启动vika客户端
export async function createVika () {
  try {
    vika = new VikaBot({
      spaceName: config.botConfig.vika.spaceName || '',
      token: config.botConfig.vika.token || '',
    })
    // 初始化系统表
    await vika.init()

    const configReady = checkConfig(config)
    // 配置齐全，启动机器人
    if (configReady) {
      return vika
    }
    return false
  } catch {
    return false
  }
}

// 启动时检查配置信息
export function checkConfig (config: configTypes.Config) {
  const missingConfiguration = []

  if (!config.botConfig.vika.token) {
    missingConfiguration.push('VIKA_TOKEN')
  }

  if (!config.botConfig.vika.spaceName) {
    missingConfiguration.push('VIKA_SPACE_NAME')
  }

  if (missingConfiguration.length > 0) {
    // log.error('\n', `错误提示:\n缺少${missingConfiguration.join()}配置参数,请在.env文件中设置或设置环境变量\n\n======================================`)
    log.info('机器人配置信息:', config)
    return false
  }
  return true
}

// 更新任务
export async function updateJobs (bot: Wechaty, vika: any) {
  try {
    // 结束所有任务
    await schedule.gracefulShutdown()
    log.info('结束所有任务成功...')
  } catch (e) {
    log.error('结束所有任务失败：', e)
  }
  try {
    const tasks = await vika.getTimedTask()
    log.info('获取到的定时提醒任务：\n', JSON.stringify(tasks))
    jobs = {}
    for (let i = 0; i < tasks.length; i++) {
      const task: TaskConfig = tasks[i]
      if (task.active) {
        // 格式化任务
        const curRule = getRule(task)
        log.info('当前任务原始信息:\n', curRule, JSON.stringify(task))

        try {
          await schedule.scheduleJob(task.id, curRule, async () => {
            try {
              if (task.targetType === 'contact') {
                try {
                  const contact = await getContact(bot, task.target as BusinessUser)
                  if (contact) {
                    await sendMsg(contact, task.msg)
                    await wait(200)
                  } else {
                    log.info('当前好友不存在:', JSON.stringify(task.target))
                  }
                } catch (e) {
                  log.error('发送好友定时任务失败:', e)
                }
              }

              if (task.targetType === 'room') {
                try {
                  const room = await getRoom(bot, task.target as BusinessRoom)
                  if (room) {
                    await sendMsg(room, task.msg)
                    await wait(200)
                  } else {
                    log.info('当前群不存在:', JSON.stringify(task.target))
                  }
                } catch (e) {
                  log.error('发送群定时任务失败:', e)
                }
              }
            } catch (err) {
              log.error('定时任务执行失败:', err)
            }
          })
          jobs[task.id] = task
        } catch (e) {
          log.error('创建定时任务失败:', e)
        }
      }
    }
    log.info('定时提醒任务初始化完成，创建任务数量:\n', Object.keys(jobs).length)

  } catch (err: any) {
    log.error('更新定时提醒列表任务失败:\n', err)
  }
}

export const onReadyOrLogin = async (bot: Wechaty) => {
  const user: Contact = bot.currentUser
  // 检查维格表配置并启动
  if (config.botConfig.vika.spaceName && config.botConfig.vika.token) {
    try {
      const res = await createVika()
      isVikaOk = true
      log.info('初始化vika成功:\n', JSON.stringify(res))
      await vika.getDataBases()
      // log.info('系统表字典:', JSON.stringify(dataBases, undefined, 2))
    } catch (err) {
      log.info('初始化vika失败:\n', err)
    }
  } else {
    log.error('\n维格表配置不全，.env文件或环境变量中中设置的token和spaceName之后重启\n\n================================================\n')
  }
  if (isVikaOk) {
    // 启动MQTT通道
    if (config.botConfig.mqtt.password && config.botConfig.mqtt.username && config.botConfig.mqtt.endpoint && (config.functionOnStatus.mqtt.mqttControl || config.functionOnStatus.mqtt.mqttMessagePush)) {
      chatdev = new ChatDevice(config.botConfig.mqtt.username, config.botConfig.mqtt.password, config.botConfig.mqtt.endpoint, config.botConfig.mqtt.port, user.id)
      if (config.functionOnStatus.mqtt.mqttControl) {
        chatdev.init(bot)
      }
    }

    const envConfig = await vika.getConfig()
    log.info('维格表中的环境变量配置信息：\n', JSON.stringify(envConfig))

    await getWhiteList()

    // 启动时更新云端好友和群
    // await vika.updateRooms(bot)
    // await vika.updateContacts(bot)

    // 如果开启了MQTT推送，心跳同步到MQTT,每30000s一次
    setInterval(() => {
      try {
        const curDate = new Date().toLocaleString()
        log.info('当前时间:', curDate)
        if (chatdev && config.functionOnStatus.mqtt.mqttMessagePush) {
          chatdev.pub_property(propertyMessage('lastActive', curDate))
        }
      } catch (err) {
        log.error('发送心跳失败:', err)
      }
    }, 300000)

    // 启动用户定时定时提醒任务
    await updateJobs(bot, vika)
    log.info('\n登录启动成功，程序准备就绪\n================================================\n')
  } else {
    log.info('\n登录启动成功，但没有配置维格表\n================================================\n')
  }

  if (config.botConfig.adminRoom.adminRoomId || config.botConfig.adminRoom.adminRoomTopic) {
    const adminRoom = await getRoom(bot, { topic: config.botConfig.adminRoom.adminRoomTopic, id: config.botConfig.adminRoom.adminRoomId })
    await adminRoom?.say(`${new Date().toLocaleString()}\nchatflow启动成功!\n当前登录用户${bot.currentUser.name()}\n可输入【帮助】获取操作指令`)
  }
}

export async function onScan (qrcode: string, status: ScanStatus) {
  // 上传二维码到维格表，可通过扫码维格表中二维码登录
  if (isVikaOk) await vika.onScan(qrcode, status)

  // 控制台显示二维码
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    const qrcodeUrl = encodeURIComponent(qrcode)
    const qrcodeImageUrl = [
      'https://wechaty.js.org/qrcode/',
      qrcodeUrl,
    ].join('')
    log.info('机器人启动，使用手机微信扫描二维码登录', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)
    qrcodeTerminal.generate(qrcode, { small: true })  // show qrcode on console
  } else {
    log.error('机器人启动，获取登录二维码失败', 'onScan: %s(%s)', ScanStatus[status], status)
  }
}

export function ChatFlow (config: configTypes.Config): WechatyPlugin {
  log.verbose('ChatFlow', 'ChatFlow is used.')

  return function ChatFlowPlugin (bot: Wechaty): void {
    log.verbose('StoreByVika', 'installing on %s ...', bot)

    bot.on('scan', async (qrcode: string, status: ScanStatus) => {
      // 上传二维码到维格表，可通过扫码维格表中二维码登录
      if (isVikaOk) await vika.onScan(qrcode, status)

      // 控制台显示二维码
      if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
        const qrcodeUrl = encodeURIComponent(qrcode)
        const qrcodeImageUrl = [
          'https://wechaty.js.org/qrcode/',
          qrcodeUrl,
        ].join('')
        log.info('机器人启动，使用手机微信扫描二维码登录', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)
        qrcodeTerminal.generate(qrcode, { small: true })  // show qrcode on console
      } else {
        log.error('机器人启动，获取登录二维码失败', 'onScan: %s(%s)', ScanStatus[status], status)
      }
    })
    bot.on('login', async (user: Contact) => {
      log.info('onLogin,当前登录的账号信息:\n', user.name())

      // 更新机器人基本信息
      config.botInfo = user.payload as configTypes.BotInfo
      await updateConfig(config)

      // 登录成功向机器人自己发送上线通知（不是所有的puppet都支持想自己发消息）
      // await sendMsg(user, '上线:' + curDate)
      if ([ 'wechaty-puppet-xp' ].includes(config.botConfig.wechaty.puppet)) await onReadyOrLogin(bot)
    })
    bot.on('ready', async () => {
      const user: Contact = bot.currentUser
      log.info('onReady,当前登录的账号信息:\n', user.name())
      config.botInfo = user.payload as configTypes.BotInfo
      await updateConfig(config)

      // 登录成功向机器人自己发送上线通知（不是所有的puppet都支持想自己发消息）
      // await sendMsg(user, '上线:' + curDate)

      if (![ 'wechaty-puppet-xp' ].includes(config.botConfig.wechaty.puppet)) await onReadyOrLogin(bot)
    })
    bot.on('logout', (user: Contact) => {
      log.info('logout，退出登录:', '%s logout', user)
      // job.cancel()
    })
    bot.on('message', async message => {
      log.info('onMessage,接收到消息:\n', JSON.stringify(message.payload))

      // 存储消息到db
      const addRes = await addMessage(message)
      if (addRes) {
        const curDate = new Date().toLocaleString()
        const talker = message.talker()
        // const name = talker.name()
        // const alias = await talker.alias()
        const text = message.text()
        const room = message.room()
        const roomId = room?.id
        const topic = await room?.topic()
        const keyWord = bot.currentUser.name()
        const isSelf = message.self()
        let isAdminRoom: boolean = false

        if (room && room.id) {

          // 机器人发送 设置为管理群 到群，设置管理员群
          if (message.self() && text === '设置为管理群') {
            config.botConfig['adminRoom'] = {
              adminRoomId: room.id,
              adminRoomTopic: await room.topic(),
            }
            await updateConfig(config)
            await sendMsg(message, '设置管理群成功')
          }
        }

        isAdminRoom = (roomId && (roomId === config.botConfig.adminRoom.adminRoomId || topic === config.botConfig.adminRoom.adminRoomTopic)) || isSelf

        // 管理员群接收到管理指令时执行相关操作
        if (isAdminRoom) {
          // log.info('管理员/群消息：', talker.name(), topic)

          if (message.type() === bot.Message.Type.Attachment) {
            await sendNotice(bot, message)
          }

          let replyText: string = ''
          if (text === '帮助') {
            replyText = '操作指令说明:\n【更新配置】 更新全部配置\n【更新定时提醒】 更新定时提醒任务\n【更新白名单】 更新智能问答白名单\n【更新通讯录】 更新维格表通信录\n【下载通讯录】 下载通讯录xlsx表\n【下载通知模板】 下载通知模板'
            await sendMsg(message, replyText)
          }

          if ([ '更新配置', '更新定时提醒', '更新通讯录', '上传配置', '下载配置', '更新白名单', '更新活动', '报名活动', '群发通知' ].includes(text)) {
            switch (text) {
              case '更新配置':
                log.info('热更新系统配置~')
                try {
                  await getCloudConfig()
                  replyText = '配置更新成功~'
                } catch (e) {
                  replyText = '配置更新失败~'
                }
                break
              case '更新定时提醒':
                log.info('热更新通知任务~')
                try {
                  await updateJobs(bot, vika)
                  replyText = '提醒任务更新成功~'
                } catch (e) {
                  replyText = '提醒任务更新失败~'
                }
                break
              case '更新通讯录':
                log.info('热更新通讯录到维格表~')
                try {
                  await vika.updateContacts(bot)
                  await vika.updateRooms(bot)
                  replyText = '通讯录更新成功~'
                } catch (e) {
                  replyText = '通讯录更新失败~'
                }
                break
              case '更新白名单':
                log.info('热更新白名单~')
                try {
                  await getWhiteList()
                  replyText = '白名单更新成功~'
                } catch (e) {
                  replyText = '白名单更新失败~'
                }
                break
              case '更新活动':
                log.info('热更新活动~')
                try {
                  await vika.getStatistics()
                  replyText = '活动更新成功~'
                } catch (e) {
                  log.error('活动更新失败：', e)
                  replyText = '活动更新失败~'
                }
                break
              case '群发通知':
                log.info('群发通知~')
                try {
                  replyText = await pubGroupNotifications(bot)
                } catch (e) {
                  log.error('获取群发通知失败：', e)
                  replyText = '群发通知失败~'
                }
                break

              case '报名活动':
                log.info('报名活动~')
                try {
                  await vika.createOrder(message)
                  replyText = '报名成功~'
                } catch (e) {
                  replyText = '报名失败~'
                }
                break
              case '上传配置':
                log.info('上传配置信息到维格表~')
                try {
                  await vika.updateConfigToVika(config)
                  replyText = '上传配置信息成功~'
                } catch (e) {
                  replyText = '上传配置信息失败~'
                }
                break
              case '下载配置':
                log.info('上传配置信息到维格表~')
                try {
                  await getCloudConfig()
                  replyText = '下载配置信息成功~'
                } catch (e) {
                  replyText = '下载配置信息失败~'
                }
                break
              default:
                // 当text不匹配任何case时执行的操作
                break
            }

            await sendMsg(message, getNow() + replyText)
          }

          if (!isVikaOk && [ '更新配置', '更新定时提醒', '更新通讯录' ].includes(text)) {
            await sendMsg(message, '未配置维格表，指令无效')
          }

          switch (text) {
            case '下载csv通讯录':
              log.info('下载通讯录到csv表~')
              try {
                const fileBox = await exportContactsAndRoomsToCSV(bot)
                await sendMsg(message, fileBox)
              } catch (err) {
                log.error('exportContactsAndRoomsToCSV', err)
                await sendMsg(message, '下载失败~')
              }
              break
            case '下载通讯录':
              log.info('下载通讯录到xlsx表~')
              try {
                const fileBox = await exportContactsAndRoomsToXLSX(bot)
                await sendMsg(message, fileBox)
              } catch (err) {
                log.error('exportContactsAndRoomsToXLSX', err)
                await sendMsg(message, '下载失败~')
              }
              break
            case '下载通知模板':
              log.info('下载通知模板~')
              try {
                const fileBox = FileBox.fromFile('./src/public/templates/群发通知模板.xlsx')
                await sendMsg(message, fileBox)
              } catch (err) {
                log.error('下载模板失败', err)
                await sendMsg(message, '下载失败，请重试~')
              }
              break
            case '初始化':
              log.info('初始化系统~')
              try {
                await vika.init()
                await sendMsg(message, '初始化系统表完成~')
              } catch (err) {
                log.error('初始化系统失败', err)
                await sendMsg(message, '初始化系统失败，请重试~')
              }
              break
            default:
              break
          }
        }

        // 微信对话开放平台智能问答
        if (room && roomId && !isSelf) {
          // 检测顺风车信息并格式化
          // const KEYWORD_LIST = [ '人找车', '车找人' ]
          // try {
          //   // 判断消息中是否包含关键词
          //   if (KEYWORD_LIST.some(keyword => message.text().includes(keyword))) {
          //     const replyMsg = await getFormattedRideInfo(message)
          //     if (replyMsg) {
          //       const replyText = replyMsg.choices[0].message.content.replace(/\r/g, '')
          //       log.info('回复内容:', replyText)
          // await sendMsg(room, replyText)
          //     }
          //   }
          // } catch (err) {

          // }

          // 智能问答开启时执行
          if (config.functionOnStatus.autoQa.autoReply && ((text.indexOf(keyWord) !== -1 && config.functionOnStatus.autoQa.atReply) || !config.functionOnStatus.autoQa.atReply)) {
            if (config.functionOnStatus.autoQa.roomWhitelist && config.roomWhiteList) {
              const isInRoomWhiteList = await containsRoom(config.roomWhiteList.qa, room)
              try {
                if (isInRoomWhiteList) {
                  log.info('当前群在qa白名单内，请求问答...')
                  await wxai(config, bot, talker, room, message)
                } else {
                  log.info('当前群不在qa白名单内，流程结束')
                }

              } catch (e) {
                log.error('发起请求wxai失败', topic, e)
              }

            } else {
              log.info('系统未开启qa群白名单，请求问答...')
              try {
                await wxai(config, bot, talker, room, message)
              } catch (e) {
                log.error('发起请求wxai失败', topic, e)
              }
            }
          }

          // 活动管理
          if (config.roomWhiteList) {
            const isActInRoomWhiteList = await containsRoom(config.roomWhiteList.act, room)
            try {
              if (isActInRoomWhiteList) {
                log.info('当前群在act白名单内，开始请求活动管理...')
                await activityController(message, room)
              }
            } catch (e) {
              log.error('活动管理失败', topic, e)
            }
          }
        }

        if ((!room || !room.id) && !isSelf) {
          // 智能问答开启时执行
          if (config.functionOnStatus.autoQa.autoReply && ((text.indexOf(keyWord) !== -1 && config.functionOnStatus.autoQa.atReply) || !config.functionOnStatus.autoQa.atReply)) {
            if (config.functionOnStatus.autoQa.contactWhitelist && config.contactWhiteList) {

              try {
                const isInContactWhiteList = await containsContact(config.contactWhiteList.qa, talker)
                if (isInContactWhiteList) {
                  log.info('当前好友在qa白名单内，请求问答...')
                  await wxai(config, bot, talker, undefined, message)
                } else {
                  log.info('当前好友不在qa白名单内，流程结束')
                }
              } catch (e) {
                log.error('发起请求wxai失败', talker.name(), e)
              }
            } else {
              log.info('系统未开启qa好友白名单,对所有好友有效，请求问答...')
              try {
                await wxai(config, bot, talker, undefined, message)
              } catch (e) {
                log.error('发起请求wxai失败', talker.name(), e)
              }
            }
          }
        }

        // 消息存储到维格表
        if (isVikaOk) {
          await vika.onMessage(message)
        }

        // 消息通过MQTT上报
        if (chatdev && config.functionOnStatus.mqtt.mqttMessagePush) {
          /*
          将消息通过mqtt通道上报到云端
          */
          // chatdev.pub_message(message)
          chatdev.pub_event(eventMessage('onMessage', { curDate }))
        }
      }
    })

    bot.on('room-join', async (room: Room, inviteeList: Contact[], inviter: any) => {
      const nameList = inviteeList.map(c => c.name()).join(',')
      log.info(`roomJoin,接收到消息:群 ${await room.topic()} 有新成员 ${nameList}, 邀请人 ${inviter}`)

      // 进群欢迎语，仅对开启了进群欢迎语白名单的群有效
      if (isVikaOk && config.welcomeList?.includes(room.id) && inviteeList.length) {
        await sendMsg(room, `欢迎加入${await room.topic()},请阅读群公告~`, inviteeList)
      }
    })
    bot.on('error', async (err: any) => {
      log.error('onError，bot运行错误:', JSON.stringify(err))
      // try {
      //   // job.cancel()
      // } catch (e) {
      //   log.error('销毁定时任务失败:', JSON.stringify(e))
      // }
    },
    )
  }

}

// 配置机器人
export function getBotOps (puppet: string, token: string) {
  const ops: any = {
    name: 'chatflow',
    puppet,
    puppetOptions: {
      token,
    },
  }

  if (puppet === 'wechaty-puppet-service') {
    process.env['WECHATY_PUPPET_SERVICE_NO_TLS_INSECURE_CLIENT'] = 'true'
  }

  if ([ 'wechaty-puppet-wechat4u', 'wechaty-puppet-xp', 'wechaty-puppet-engine' ].includes(puppet)) {
    delete ops.puppetOptions.token
  }

  if (puppet === 'wechaty-puppet-wechat') {
    delete ops.puppetOptions.token
    ops.puppetOptions.uos = true
  }

  log.info('Wchaty配置信息:\n', JSON.stringify(ops))
  return ops
}

export {
  config,
}
