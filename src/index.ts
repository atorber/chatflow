#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/* eslint-disable sort-keys */
import 'dotenv/config.js'
import { WechatyPlugin, Wechaty, log, WechatyBuilder } from 'wechaty'
import onScan from './handlers/on-scan.js'
import onError from './handlers/on-error.js'
import onRoomjoin from './handlers/on-roomjoin.js'
import onLogout from './handlers/on-logout.js'
import onLogin from './handlers/on-login.js'
import onReady from './handlers/on-ready.js'
import onMessage from './handlers/on-message.js'
import { getBotOps } from './services/configService.js'
import delay, { logForm } from './utils/utils.js'
import { ChatFlowCore, WechatyConfig } from './api/base-config.js'
import { MqttProxy, IClientOptions } from './proxy/mqtt-proxy.js'
import { BiTable } from './db/lark-db.js'

import getAuthClient from './utils/auth.js'
import { GroupMaster, GroupMasterOptions } from './plugins/mod.js'
import fs from 'fs'
import { join } from 'path'

interface ChatFlowOptions {
  spaceId: string
  token: string
  adminRoomTopic: string
  endpoint?: string
  dataDir?: string
}

function ChatFlow (options?: ChatFlowOptions): WechatyPlugin {
  logForm('ChatFlow插件开始启动...\n\n启动过程需要30秒到1分钟\n\n请等待系统初始化...')

  return function ChatFlowPlugin (bot: Wechaty): void {

    ChatFlowCore.bot = bot
    ChatFlowCore.spaceId = options?.spaceId || ''
    ChatFlowCore.token = options?.token || ''
    ChatFlowCore.adminRoomTopic = options?.adminRoomTopic || ''
    ChatFlowCore.endpoint = options?.endpoint || ChatFlowCore.endpoint
    ChatFlowCore.dataDir = options?.dataDir ||  ChatFlowCore.dataDir

    bot.on('scan', onScan)
    bot.on('login', onLogin)
    bot.on('ready', onReady)
    bot.on('logout', onLogout)
    bot.on('message', onMessage)
    bot.on('room-join', onRoomjoin)
    bot.on('error', onError)

  }

}

const init = async (options: ChatFlowOptions) => {
  // log.info('初始化ChatFlowCore...', JSON.stringify(options))
  // 获取根目录
  const rootDir =  options.dataDir || process.cwd()
  log.info('rootDir', rootDir)
  ChatFlowCore.setOptions(options)
  const authClient = getAuthClient({
    password: options.token,
    username: options.spaceId,
    endpoint: options.endpoint || '',
  })
  // 检测./data文件夹，如果不存在则创建
  // 在程序安装目录下创建/data目录，用于存放配置文件、日志文件、数据库文件、媒体文件等
  if (!fs.existsSync(join(rootDir, 'data'))) {
    fs.mkdirSync(join(rootDir, 'data'))
  }

  if (!fs.existsSync(join(rootDir, 'data/table'))) {
    fs.mkdirSync(join(rootDir, 'data/table'))
  }
  if (!fs.existsSync(join(rootDir, 'data/logs'))) {
    fs.mkdirSync(join(rootDir, 'data/logs'))
  }
  if (!fs.existsSync(join(rootDir, 'data/db'))) {
    fs.mkdirSync(join(rootDir, 'data/db'))
  }
  if (!fs.existsSync(join(rootDir, 'data/media'))) {
    fs.mkdirSync(join(rootDir, 'data/media'))
  }
  if (!fs.existsSync(join(rootDir, 'data/media/image'))) {
    fs.mkdirSync(join(rootDir, 'data/media/image'))
  }
  if (!fs.existsSync(join(rootDir, 'data/media/image/room'))) {
    fs.mkdirSync(join(rootDir, 'data/media/image/room'))
  }
  if (!fs.existsSync(join(rootDir, 'data/media/image/contact'))) {
    fs.mkdirSync(join(rootDir, 'data/media/image/contact'))
  }
  if (!fs.existsSync(join(rootDir, 'data/media/image/qrcode'))) {
    fs.mkdirSync(join(rootDir, 'data/media/image/qrcode'))
  }

  // 远程加载配置信息，初始化api客户端
  try {
    try {
      // 初始化检查数据库表，如果不存在则创建
      const initRes = await authClient?.init(options.spaceId, options.token)
      logForm('初始化检查系统表结果：' + JSON.stringify(initRes.data))

      if (initRes.data && initRes.data.message === 'success') {
        logForm('初始化检查系统表成功...')
        ChatFlowCore.db = initRes.data.data
      } else {
        logForm('初始化检查系统表失败...' + JSON.stringify(initRes.data))
        // 中止程序
        throw new Error('初始化检查系统表失败...', initRes)
      }
    } catch (e) {
      log.error('请求初始化检查系统表失败...', e)
      throw e
    }
    await delay(1000)
    try {
      const loginRes = await authClient?.login(options.spaceId, options.token)
      logForm('登录客户端结果：' + JSON.stringify(loginRes))
      ChatFlowCore.isLogin = true
    } catch (e) {
      log.error('登录客户端失败...', e)
      throw e
    }
  } catch (e) {
    log.error('登录客户端失败...', e)
  }

  // 从配置文件中读取配置信息，包括wechaty配置、mqtt配置以及是否启用mqtt推送或控制
  try {
    const configAll = await ChatFlowCore.init(options)
    // log.info('configAll', JSON.stringify(configAll))

    const config: CloudConfig | undefined = configAll // 默认使用vika，使用lark时，需要传入'lark'参数await ChatFlowCore.init('lark')
    // log.info('config', JSON.stringify(config, undefined, 2))

    // 构建机器人
    // 如果MQTT推送或MQTT控制打开，则启动MQTT代理
    if (config.mqttIsOn) {
      log.info('启动MQTT代理...', JSON.stringify(config.mqttConfig))
      try {
        const mqttProxy = MqttProxy.getInstance(config.mqttConfig)
        if (mqttProxy && ChatFlowCore.bot) {
          mqttProxy.setWechaty(ChatFlowCore.bot)
        }
      } catch (e) {
        log.error('MQTT代理启动失败，检查mqtt配置信息是否正确...', e)
      }
    }
    return config
  } catch (e) {
    log.error('初始化ChatFlowCore失败...', e)
    return undefined
  }

}

export interface CloudConfig {
  mqttConfig: IClientOptions,
  wechatyConfig: WechatyConfig,
  mqttIsOn: boolean,
}

export {
  WechatyBuilder,
  init,
  getBotOps,
  ChatFlowCore,
  log,
  logForm,
  BiTable,
  type IClientOptions,
  MqttProxy,
  ChatFlow,
  GroupMaster,
}

export type {
  GroupMasterOptions,
  ChatFlowOptions,
  Wechaty,
}

export type { WechatyConfig }
