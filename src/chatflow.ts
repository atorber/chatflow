#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/* eslint-disable sort-keys */
import 'dotenv/config.js'
import {
  Contact,
  ScanStatus,
  WechatyPlugin,
  log,
  Wechaty,
  Room,
  Message,
  // types,
} from 'wechaty'

import qrcodeTerminal from 'qrcode-terminal'
import { FileBox } from 'file-box'
import {
  sendNotice,
  wxai,
  ChatDevice,
  propertyMessage,
  eventMessage,
  exportContactsAndRoomsToCSV,
  exportContactsAndRoomsToXLSX,
  getRoom,
} from './plugins/mod.js'

import {
  // config,
  getBotOps,
  sendMsg,
  updateConfig,
} from './services/configService.js'

import {
  waitForMs as wait,
  getNow,
  logForm,
} from './utils/utils.js'

import { addMessage } from './api/message.js'
import { containsContact, containsRoom } from './services/userService.js'
import { activityController } from './services/activityService.js'

import {
  MessageChat,
  EnvChat,
  WhiteListChat,
  GroupNoticeChat,
  RoomChat,
  ContactChat,
  ActivityChat,
  NoticeChat,
  QaChat,
  KeywordChat,
} from './services/mod.js'
import { WxOpenaiBot, type WxOpenaiBotConfig, type SkillInfoArray } from './services/wxopenaiService.js'
import type { ContactWhiteList, ProcessEnv, RoomWhiteList, ChatMessage } from './types/mod.js'
import { spawn } from 'child_process'
import type { VikaBot } from './db/vika-bot.js'

// log.info('初始化配置文件信息:\n', JSON.stringify(config, undefined, 2), '================')
// log.info('process.env', JSON.stringify(process.env))

let chatdev: any = {}
let vikaBot: VikaBot|undefined
const envService:EnvChat = new EnvChat()
let configEnv:ProcessEnv = envService.getConfigFromEnv()
// log.info('configEnv on env', JSON.stringify(configEnv))

let whiteList:{contactWhiteList: ContactWhiteList; roomWhiteList: RoomWhiteList;}

interface Services {
  [key: string]: any;  // 索引签名
  messageService: MessageChat;
  whiteListService: WhiteListChat;
  groupNoticeService: GroupNoticeChat;
  roomService: RoomChat;
  contactService: ContactChat;
  activityService: ActivityChat;
  noticeService: NoticeChat;
  qaService: QaChat;
  keywordService: KeywordChat;
}

export const initializeServices = async (vikaBot: VikaBot) => {
  const services:Services = {} as Services
  const serviceClasses = [
    { service: MessageChat, variable: 'messageService' },
    { service: WhiteListChat, variable: 'whiteListService' },
    { service: GroupNoticeChat, variable: 'groupNoticeService' },
    { service: RoomChat, variable: 'roomService' },
    { service: ContactChat, variable: 'contactService' },
    { service: ActivityChat, variable: 'activityService' },
    { service: NoticeChat, variable: 'noticeService' },
    { service: QaChat, variable: 'qaService' },
    { service: KeywordChat, variable: 'keywordService' },
  ]

  for (const { service, variable } of serviceClasses) {
    const Service = service
    services[variable] = new Service(vikaBot)
    await wait(1000)
  }
  return services
}

let services:Services | undefined

// Later in your code, you can access these services like so:
// services.messageService, services.envService, etc.

const initializeServicesAndEnv = async (vikaBot:VikaBot) => {
  // log.info('初始化服务开始...')
  await envService.init(vikaBot)
  await wait(1000)
  services = await initializeServices(vikaBot)
  // log.info('services:', JSON.stringify(services))
}

const shouldInitializeMQTT = () => {
  return configEnv.MQTT_ENDPOINT && (configEnv.MQTT_MQTTCONTROL || configEnv.MQTT_MQTTMESSAGEPUSH)
}

const initializeMQTT = (bot: Wechaty) => {
  chatdev = new ChatDevice(configEnv.MQTT_USERNAME, configEnv.MQTT_PASSWORD, configEnv.MQTT_ENDPOINT, configEnv.MQTT_PORT, configEnv.BASE_BOT_ID)
  chatdev.init(bot)
}

const postVikaInitialization = async (bot: Wechaty, services:Services) => {
  const vikaConfig = await envService.getConfigFromVika()
  // log.info('维格表中的环境变量配置信息：', JSON.stringify(vikaConfig, undefined, 2))

  configEnv = { ...configEnv, ...vikaConfig }
  // log.info('configEnv on vika', JSON.stringify(configEnv))

  whiteList = await services.whiteListService.getWhiteList()

  await services.roomService.updateRooms(bot, configEnv.WECHATY_PUPPET)
  await services.contactService.updateContacts(bot, configEnv.WECHATY_PUPPET)

  setInterval(() => {
    try {
      const curDate = new Date().toLocaleString()
      log.info('当前时间:', curDate)
      if (chatdev && chatdev.isOk && configEnv.MQTT_MQTTMESSAGEPUSH) {
        chatdev.pub_property(propertyMessage('lastActive', curDate))
      }
    } catch (err) {
      log.error('发送心跳失败:', err)
    }
  }, 300000)

  await services.noticeService.updateJobs(bot, vikaBot, services.messageService)
  logForm('启动成功，系统准备就绪，在管理员群发送【帮助】可获取操作指令集')
}

const notifyAdminRoom = async (bot: Wechaty) => {
  if (configEnv.ADMINROOM_ADMINROOMID || configEnv.ADMINROOM_ADMINROOMTOPIC) {
    const adminRoom = await getRoom(bot, { topic: configEnv.ADMINROOM_ADMINROOMTOPIC, id: configEnv.ADMINROOM_ADMINROOMID })
    await adminRoom?.say(`${new Date().toLocaleString()}\nchatflow启动成功!\n当前登录用户${bot.currentUser.name()}\n可输入【帮助】获取操作指令`)
  }
}

const onReadyOrLogin = async (bot: Wechaty, vikaBot:VikaBot|undefined) => {
  if (!services) {
    log.info('初始化services服务')
    await initializeServicesAndEnv(vikaBot as VikaBot)
  }

  const user: Contact = bot.currentUser
  log.info('当前登录的账号信息:', user.name())
  if (!configEnv.VIKA_SPACE_NAME || !configEnv.VIKA_TOKEN) {
    log.error('维格表配置不全，.env文件或环境变量中设置的token和spaceName之后重启')
    return
  }

  if (shouldInitializeMQTT()) {
    initializeMQTT(bot)
  }

  if (vikaBot) {
    await postVikaInitialization(bot, services as Services)
  } else {
    logForm('登录启动成功，但没有配置维格表')
  }

  await notifyAdminRoom(bot)
}

// 定义一个函数处理二维码上传
async function uploadQRCodeToVika (qrcode: string, status: ScanStatus) {
  try {
    await (services as Services).messageService.onScan(qrcode, status)
  } catch (error) {
    log.error('上传二维码到维格表失败:', error)
  }
}

// 定义一个函数显示二维码在控制台
function displayQRCodeInConsole (qrcode: string, status: ScanStatus) {
  if (status !== ScanStatus.Waiting && status !== ScanStatus.Timeout) return

  const qrcodeUrl = encodeURIComponent(qrcode)
  const qrcodeImageUrl = `https://wechaty.js.org/qrcode/${qrcodeUrl}`
  logForm(`机器人启动，使用手机微信扫描二维码登录\n\n如二维码显示不清晰可复制以下地址在浏览器打开:\n\n ${qrcodeImageUrl}`)
  qrcodeTerminal.generate(qrcode, { small: true })  // 在控制台显示二维码
}

// 监听进程退出事件
process.on('exit', (code) => {
  if (code === 1) {
    // 重新启动程序
    spawn('npm', [ 'run', 'start' ], {
      stdio: 'inherit',
    })
  }
})

// 封装成一个函数来处理错误和成功的消息发送
async function sendReplyMessage (message:Message, success: boolean, successMsg: string, errorMsg: string) {
  const replyText = success ? successMsg : errorMsg
  await sendMsg(message, getNow() + replyText, vikaBot, (services as Services).messageService)
}

interface AdminCommands {
  [key: string]: (bot:Wechaty, message:Message) => Promise<[boolean, string]>;
}

// 使用一个对象来存储命令和对应的处理函数
const adminCommands:AdminCommands = {
  更新配置: async () => {
    try {
      const botConfig = await envService.downConfigFromVika()
      log.info('botConfig:', JSON.stringify(botConfig))
      return [ true, '配置更新成功~' ]
    } catch (e) {
      return [ false, '配置更新失败~' ]
    }
  },
  更新定时提醒: async (bot:Wechaty) => {
    try {
      await (services as Services).noticeService.updateJobs(bot, vikaBot, (services as Services).messageService)
      return [ true, '提醒任务更新成功~' ]
    } catch (e) {
      return [ false, '提醒任务更新失败~' ]
    }
  },
  更新通讯录: async (bot:Wechaty) => {
    try {
      await (services as Services).contactService.updateContacts(bot, configEnv.WECHATY_PUPPET)
      await (services as Services).roomService.updateRooms(bot, configEnv.WECHATY_PUPPET)
      return [ true, '通讯录更新成功~' ]
    } catch (e) {
      return [ false, '通讯录更新失败~' ]
    }
  },
  更新白名单: async () => {
    try {
      whiteList = await (services as Services).whiteListService.getWhiteList()
      return [ true, '热更新白名单~' ]
    } catch (e) {
      return [ false, '白名单更新失败~' ]
    }
  },
  更新活动: async () => {
    try {
      await (services as Services).activityService.getStatistics()
      return [ true, '热更新活动~' ]
    } catch (e) {
      return [ false, '活动更新失败~' ]
    }
  },
  群发通知: async (bot:Wechaty) => {
    try {
      const replyText = await (services as Services).groupNoticeService.pubGroupNotifications(bot, vikaBot, (services as Services).messageService)
      return [ true, replyText ]
    } catch (e) {
      return [ false, '群发通知失败~' ]
    }
  },
  更新问答: async () => {
    let replyText = ''
    try {
      const skills:SkillInfoArray  = await (services as Services).qaService.getQa()
      if (skills.length) {
        const config: WxOpenaiBotConfig = {
          encodingAESKey: configEnv.WXOPENAI_ENCODINGAESKEY || '',
          token: configEnv.WXOPENAI_TOKEN || '',
          nonce: 'ABSBSDSD',
          appid: configEnv.WXOPENAI_APPID || '',
          managerid: configEnv.WXOPENAI_MANAGERID || '',
        }

        const aiBotInstance = new WxOpenaiBot(config)
        const result:any = await aiBotInstance.updateSkill(skills, 1)
        if (result.data && result.data.task_id) {
          const res = await aiBotInstance.publishSkill()
          console.info('发布技能成功:', res)
          replyText = '更新问答列表成功~'

        } else {
          // eslint-disable-next-line no-console
          console.error('更新问答失败Error:', result)
          replyText = '更新问答列表失败~'
        }
      } else {
        replyText = '问答列表为空，未更新任何内容~'
      }
      return [ true, replyText ]
    } catch (e) {
      return [ false, '问答列表更新失败~' ]
    }
  },
  报名活动: async (_bot:Wechaty, message:Message) => {
    try {
      await (services as Services).activityService.createOrder(message)
      return [ true, '报名成功~' ]
    } catch (e) {
      return [ false, '报名失败~' ]
    }
  },
  上传配置: async () => {
    try {
      await envService.updateConfigToVika(configEnv)

      return [ true, '上传配置信息成功~' ]
    } catch (e) {
      return [ false, '上传配置信息失败~' ]
    }
  },
  下载配置: async () => {
    try {
      const botConfig = await envService.downConfigFromVika()
      log.info('botConfig:', JSON.stringify(botConfig))
      return [ true, '下载配置信息成功~' ]
    } catch (e) {
      return [ false, '下载配置信息失败~' ]
    }
  },
}

async function handleCommand (bot:Wechaty, command: string, action: (bot:Wechaty, message:Message) => Promise<FileBox>, message: any, vikaBot: boolean, services: any) {
  log.info(`Handling command: ${command}`)
  try {
    const fileBox = await action(bot, message)
    await sendMsg(message, fileBox, vikaBot, services.messageService)
  } catch (err) {
    log.error(`${command} failed`, err)
    await sendMsg(message, '下载失败，请重试~', vikaBot, services.messageService)
  }
}

interface CommandActions {
  [key: string]: (bot:Wechaty, message:Message) => Promise<FileBox>
}

const commandActions: CommandActions = {
  下载csv通讯录: (bot:Wechaty) => exportContactsAndRoomsToCSV(bot),
  下载通讯录: (bot:Wechaty) => exportContactsAndRoomsToXLSX(bot),
  下载通知模板: () => Promise.resolve(FileBox.fromFile('./src/public/templates/群发通知模板.xlsx')),
}

async function handleAutoQA (bot:Wechaty, message:Message, keyWord:string) {
  const talker = message.talker()
  const room = message.room() as Room
  const topic = await room.topic()
  const text = message.text()
  if (configEnv.AUTOQA_AUTOREPLY && ((text.indexOf(keyWord) !== -1 && configEnv.AUTOQA_ATREPLY) || !configEnv.AUTOQA_ATREPLY)) {
    const isInRoomWhiteList = configEnv.AUTOQA_ROOMWHITELIST ? await containsRoom(whiteList.roomWhiteList.qa, room) : true
    if (isInRoomWhiteList) {
      log.info('当前群在qa白名单内，请求问答...')
      try {
        await wxai(configEnv, bot, talker, room, message)
      } catch (e) {
        log.error('发起请求wxai失败', topic, e)
      }
    }
  }
}

async function handleActivityManagement (message:Message) {
  const room = message.room() as Room
  const topic = await room.topic()
  const isActInRoomWhiteList = await containsRoom(whiteList.roomWhiteList.act, room)
  if (isActInRoomWhiteList) {
    log.info('当前群在act白名单内，开始请求活动管理...')
    try {
      await activityController(vikaBot as VikaBot, message, room)
    } catch (e) {
      log.error('活动管理失败', topic, e)
    }
  }
}

async function handleAdminRoomSetting (message:Message) {
  const text = message.text()
  const room = message.room() as Room
  if (message.self() && text === '设置为管理群') {
    configEnv.ADMINROOM_ADMINROOMID = room.id
    configEnv.ADMINROOM_ADMINROOMTOPIC = await room.topic()
    await updateConfig(configEnv)
    await sendMsg(message, '设置管理群成功', vikaBot, (services as Services).messageService)
  }
}

async function handleAutoQAForContact (bot:Wechaty, message:Message, keyWord:string) {
  const talker = message.talker()
  const text = message.text()
  if (configEnv.AUTOQA_AUTOREPLY && ((text.indexOf(keyWord) !== -1 && configEnv.AUTOQA_ATREPLY) || !configEnv.AUTOQA_ATREPLY)) {
    const isInContactWhiteList = configEnv.AUTOQA_CONTACTWHITELIST ? await containsContact(whiteList.contactWhiteList.qa, talker) : true
    if (isInContactWhiteList) {
      log.info('当前好友在qa白名单内，请求问答...')
      try {
        await wxai(configEnv, bot, talker, undefined, message)
      } catch (e) {
        log.error('发起请求wxai失败', talker.name(), e)
      }
    } else {
      log.info('当前好友不在qa白名单内，流程结束')
    }
  }
}

export function ChatFlow (vikaBot:VikaBot | undefined): WechatyPlugin {
  logForm('开始启动，启动过程需要30秒到1分钟，请等待系统初始化...')
  const welcomeList:any = []

  return function ChatFlowPlugin (bot: Wechaty): void {

    bot.on('scan', async (qrcode: string, status: ScanStatus) => {
      if (!services) {
        log.info('初始化services服务')
        await initializeServicesAndEnv(vikaBot as VikaBot)
        await wait(3000)
      }

      // 控制台显示二维码
      displayQRCodeInConsole(qrcode, status)

      // 上传二维码到维格表，可通过扫码维格表中二维码登录
      await uploadQRCodeToVika(qrcode, status)

      if (status !== ScanStatus.Waiting && status !== ScanStatus.Timeout) {
        log.error('机器人启动，获取登录二维码失败', `onScan: ${ScanStatus[status]}(${status})`)
      }
    })

    bot.on('login', async (user: Contact) => {
      // log.info('onLogin,当前登录的账号信息:\n', user.name())

      await updateConfig(configEnv)

      if ([ 'wechaty-puppet-xp' ].includes(configEnv.WECHATY_PUPPET)) await onReadyOrLogin(bot, vikaBot)
    })

    bot.on('ready', async () => {
      // const user: Contact = bot.currentUser
      // log.info('onReady,当前登录的账号信息:\n', user.name())
      await updateConfig(configEnv)

      if (![ 'wechaty-puppet-xp' ].includes(configEnv.WECHATY_PUPPET)) await onReadyOrLogin(bot, vikaBot)

    })

    bot.on('logout', (user: Contact) => {
      log.info('logout，退出登录:', '%s logout', user)
      // job.cancel()
    })

    bot.on('message', async message => {
      // if (message.type() === types.Message.Text) {
      //   log.info('onMessage,接收到消息:\n', JSON.stringify(message.payload))
      // } else {
      //   log.info('onMessage,接收到消息:\n', JSON.stringify(message.payload))
      // }

      // 存储消息到db，如果写入失败则终止
      const addRes = await addMessage(message)
      if (!addRes) return

      const text = message.text()
      const talker = message.talker()
      const listener = message.listener()
      const room = message.room()
      const roomId = room?.id
      const topic = await room?.topic()
      const type = message.type()
      const keyWord = bot.currentUser.name()
      const isSelf = message.self()
      const isAdminRoom: boolean = (roomId && (roomId === configEnv.ADMINROOM_ADMINROOMID || topic === configEnv.ADMINROOM_ADMINROOMTOPIC)) || isSelf

      const chatMessage:ChatMessage = {
        text,
        type,
        talker:{
          name:talker.name(),
          id:talker.id,
          alias: await talker.alias(),
        },
        room:{
          topic,
          id:room?.id,
        },
        listener:{
          id:listener?.id,
          name:listener?.name(),
          alias: await listener?.alias(),
        },
      }
      log.info('onMessage,接收到消息,chatMessage:\n', JSON.stringify(chatMessage))

      // 管理员群接收到管理指令时执行相关操作
      if (isAdminRoom) {
        if (message.type() === bot.Message.Type.Attachment) {
          await sendNotice(bot, message)
        }

        if (text === '帮助') {
          const replyText = await (services as Services).keywordService.getSystemKeywordsText()
          await sendMsg(message, replyText, vikaBot, (services as Services).messageService)
        } else if (Object.prototype.hasOwnProperty.call(adminCommands, text)) {
          const command = adminCommands[text as keyof typeof adminCommands]
          if (typeof command === 'function') {
            const [ success, replyText ] = await command(bot, message)
            await sendReplyMessage(message, success, replyText, replyText)
          }
        }

        if (!vikaBot && [ '更新配置', '更新定时提醒', '更新通讯录' ].includes(text)) {
          await sendMsg(message, '未配置维格表，指令无效', vikaBot, (services as Services).messageService)
        }

        if (Object.prototype.hasOwnProperty.call(commandActions, text)) {
          const command = commandActions[text]
          if (typeof command === 'function') {
            await handleCommand(bot, text, command, message, Boolean(vikaBot), services)
          }
        }
      }

      // 群消息处理
      if (room && room.id) {
        if (!isSelf) {
          if (vikaBot) await handleAutoQA(bot, message, keyWord)
          await handleActivityManagement(message)
        }
        await handleAdminRoomSetting(message)
      }

      // 非群消息处理
      if ((!room || !room.id) && !isSelf && vikaBot) {
        await handleAutoQAForContact(bot, message, keyWord)
      }

      // 消息存储到维格表
      if (configEnv.VIKA_UPLOADMESSAGETOVIKA) {
        // log.info('消息同步到维格表...')
        await (services as Services).messageService.onMessage(message)
      }

      // 消息通过MQTT上报
      if (chatdev && chatdev.isOk && configEnv.MQTT_MQTTMESSAGEPUSH) {
        /*
          将消息通过mqtt通道上报到云端
          */
        // chatdev.pub_message(message)
        chatdev.pub_event(eventMessage('onMessage', message))
      }

    })

    bot.on('room-join', async (room: Room, inviteeList: Contact[], inviter: Contact) => {
      const roomTopic = await room.topic()
      const nameList = inviteeList.map(c => c.name()).join(',')
      const inviterName = inviter.name()

      log.info(`Room Join: Room "${roomTopic}" got new members "${nameList}", invited by "${inviterName}"`)

      // Check if Vika is OK and if the room is in the welcome list
      if (vikaBot && welcomeList?.includes(room.id)) {
        // Send a welcome message only if there are invitees
        if (inviteeList.length > 0) {
          const welcomeMessage = `欢迎加入${roomTopic}, 请阅读群公告~`
          await sendMsg(room, welcomeMessage, vikaBot, (services as Services).messageService, inviteeList)
        }
      }
    })

    bot.on('error', async (err: any) => {
      log.error('onError，bot运行错误:', JSON.stringify(err))
      // 退出当前进程并重启程序
      // process.exit(1)
    },
    )
  }

}

export {
  configEnv,
  getBotOps,
}
