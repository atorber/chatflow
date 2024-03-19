#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/* eslint-disable sort-keys */
import 'dotenv/config.js'
import { WechatyPlugin, Wechaty, log } from 'wechaty'
import onScan from './handlers/on-scan.js'
import onError from './handlers/on-error.js'
import onRoomjoin from './handlers/on-roomjoin.js'
import onLogout from './handlers/on-logout.js'
import onLogin from './handlers/on-login.js'
import onReady from './handlers/on-ready.js'
import onMessage from './handlers/on-message.js'
import { getBotOps } from './services/configService.js'
import delay, { logForm, logger } from './utils/utils.js'
import { ChatFlowConfig, WechatyConfig } from './api/base-config.js'
import { MqttProxy, IClientOptions } from './proxy/mqtt-proxy.js'
import { BiTable } from './db/lark-db.js'

import getAuthClient from './utils/auth.js'
import { GroupMaster, GroupMasterConfig } from './plugins/mod.js'
import fs from 'fs'
import { join } from 'path'

// 获取根目录
const rootDir = process.cwd()
log.info('rootDir', rootDir)

function ChatFlow (options?: {
  spaceId: string
  token: string
  adminRoomTopic?: string
  endpoint?: string
}): WechatyPlugin {
  logForm('ChatFlow插件开始启动...\n\n启动过程需要30秒到1分钟\n\n请等待系统初始化...')

  return function ChatFlowPlugin (bot: Wechaty): void {

    ChatFlowConfig.bot = bot
    ChatFlowConfig.spaceId = options?.spaceId || ''
    ChatFlowConfig.token = options?.token || ''
    ChatFlowConfig.adminRoomTopic = options?.adminRoomTopic || ''
    ChatFlowConfig.endpoint = options?.endpoint || ''

    bot.on('scan', onScan)
    bot.on('login', onLogin)
    bot.on('ready', onReady)
    bot.on('logout', onLogout)
    bot.on('message', onMessage)
    bot.on('room-join', onRoomjoin)
    bot.on('error', onError)

  }

}

const init = async (options: {
  spaceId: string
  token: string,
  endpoint?: string,
}) => {

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

  ChatFlowConfig.setOptions(options)
  // 远程加载配置信息，初始化api客户端
  try {
    const authClient = getAuthClient({
      password: options.token,
      username: options.spaceId,
      endpoint: options.endpoint || '',
    })
    try {
      // 初始化检查数据库表，如果不存在则创建
      const initRes = await authClient.init(options.spaceId, options.token)
      logForm('初始化检查系统表结果：' + JSON.stringify(initRes.data))
      logger.info('初始化检查系统表结果：' + JSON.stringify(initRes.data))

      if (initRes.data && initRes.data.message === 'success') {
        logForm('初始化检查系统表成功...')
        ChatFlowConfig.db = initRes.data.data
      } else {
        logForm('初始化检查系统表失败...' + JSON.stringify(initRes.data))
        // 中止程序
        // throw new Error('初始化检查系统表失败...', initRes)
        process.exit(1)
      }
    } catch (e) {
      log.error('请求初始化检查系统表失败...', e)
      // throw e
      process.exit(1)
    }
    await delay(1000)
    try {
      const loginRes = await authClient.login(options.spaceId, options.token)
      logForm('登录客户端结果：' + JSON.stringify(loginRes))
      ChatFlowConfig.isLogin = true
    } catch (e) {
      log.error('登录客户端失败...', e)
      throw e
    }
  } catch (e) {
    log.error('登录客户端失败...', e)
  }

  // 从配置文件中读取配置信息，包括wechaty配置、mqtt配置以及是否启用mqtt推送或控制
  try {
    const configAll = await ChatFlowConfig.init(options)
    // log.info('configAll', JSON.stringify(configAll))

    const config: CloudConfig | undefined = configAll // 默认使用vika，使用lark时，需要传入'lark'参数await ChatFlowConfig.init('lark')
    // log.info('config', JSON.stringify(config, undefined, 2))

    // 构建机器人
    // 如果MQTT推送或MQTT控制打开，则启动MQTT代理
    if (config.mqttIsOn) {
      log.info('启动MQTT代理...', JSON.stringify(config.mqttConfig))
      try {
        const mqttProxy = MqttProxy.getInstance(config.mqttConfig)
        if (mqttProxy) {
          mqttProxy.setWechaty(ChatFlowConfig.bot)
        }
      } catch (e) {
        log.error('MQTT代理启动失败，检查mqtt配置信息是否正确...', e)
      }
    }
    return config
  } catch (e) {
    log.error('初始化ChatFlowConfig失败...', e)
    return undefined
  }

}

export interface CloudConfig {
  mqttConfig: IClientOptions,
  wechatyConfig: WechatyConfig,
  mqttIsOn: boolean,
}

export {
  init,
  getBotOps,
  ChatFlowConfig,
  log,
  logForm,
  BiTable,
  type IClientOptions,
  MqttProxy,
  ChatFlow,
  GroupMaster,
}

export type {
  GroupMasterConfig,
}

export type { WechatyConfig }
