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

const init = async (options:{
  spaceName?: string
  spaceId?: string
  token: string
}, bot:Wechaty) => {
  ChatFlowConfig.bot = bot
  // 使用Vika
  await VikaDB.init(options)
  // 从配置文件中读取配置信息，包括wechaty配置、mqtt配置以及是否启用mqtt推送或控制
  const config: {
      mqttConfig: IClientOptions,
      wechatyConfig: WechatyConfig,
      mqttIsOn: boolean,
    } | undefined = await ChatFlowConfig.init() // 默认使用vika，使用lark时，需要传入'lark'参数await ChatFlowConfig.init('lark')
    // log.info('config', JSON.stringify(config, undefined, 2))
  if (config) {
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

  } else {
    logForm('维格表配置不全，缺少必要的配置信息')
  }
}

export {
  init,
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
