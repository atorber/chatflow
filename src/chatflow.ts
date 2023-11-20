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
import { logForm } from './utils/utils.js'
import { ChatFlowConfig, WechatyConfig } from './api/base-config.js'
import { MqttProxy, IClientOptions } from './proxy/mqtt-proxy.js'
import { VikaDB } from './db/vika-db.js'
import { LarkDB } from './db/lark-db.js'

import { GroupMaster, GroupMasterConfig } from './plugins/mod.js'

function ChatFlow (): WechatyPlugin {
  logForm('ChatFlow插件开始启动...\n\n启动过程需要30秒到1分钟\n\n请等待系统初始化...')

  return function ChatFlowPlugin (bot: Wechaty): void {

    ChatFlowConfig.bot = bot
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
  VikaDB,
  LarkDB,
  type IClientOptions,
  MqttProxy,
  ChatFlow,
  GroupMaster,
}

export type {
  GroupMasterConfig,
}

export type { WechatyConfig }
