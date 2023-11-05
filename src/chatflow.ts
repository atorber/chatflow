#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/* eslint-disable sort-keys */
import 'dotenv/config.js'
import {
  WechatyPlugin,
  Wechaty,
  log,
} from 'wechaty'

import onScan from './handlers/on-scan.js'
import onError from './handlers/on-error.js'
import onRoomjoin from './handlers/on-roomjoin.js'
import onLogout from './handlers/on-logout.js'
import onLogin from './handlers/on-login.js'
import onReady from './handlers/on-ready.js'
import { onMessage } from './handlers/on-message.js'

import {
  getBotOps,
} from './services/configService.js'

import {
  logForm,
  logger,
} from './utils/utils.js'

import {
  EnvChat,
} from './services/mod.js'
import { ChatFlowConfig, WechatyConfig } from './db/vika-bot.js'

logger.info('process.env：' + JSON.stringify(process.env))

export function ChatFlow (): WechatyPlugin {
  logForm('开始启动...\n启动过程需要30秒到1分钟\n请等待系统初始化...')
  return function ChatFlowPlugin (bot: Wechaty): void {
    ChatFlowConfig.bot = bot
    ChatFlowConfig.envService = new EnvChat()

    ChatFlowConfig.configEnv = ChatFlowConfig.envService.getConfigFromEnv()
    logger.info('ChatFlowConfig.configEnv on env' + JSON.stringify(ChatFlowConfig.configEnv))
    log.info('ChatFlowConfig.configEnv从环境变量中获取：', JSON.stringify(ChatFlowConfig.configEnv), undefined, 2)

    bot.on('scan', onScan)
    bot.on('login', onLogin)
    bot.on('ready', onReady)
    bot.on('logout', onLogout)
    bot.on('message', onMessage)
    bot.on('room-join', onRoomjoin)
    bot.on('error', onError)
  }

}

export {
  getBotOps,
  ChatFlowConfig,
  log,
  logForm,
}

export type { WechatyConfig }
