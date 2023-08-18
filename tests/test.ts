#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import 'dotenv/config.js'
// import fs from 'fs'
import {
  log,
  // Room,
  WechatyBuilder,
} from 'wechaty'
import { config } from '../src/services/config.js'

// import { StoreByVika } from './plugins/basic-data-storage-for-vika.js'
import { ChatFlow } from '../src/chatflow.js'

// 配置机器人
function getBotOps (puppet:string, token:string) {
  const ops:any = {
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

  log.info('bot ops:', JSON.stringify(ops))
  return ops
}

// 构建机器人
const ops = getBotOps(config.botConfig.wechaty.puppet, config.botConfig.wechaty.token)
const bot = WechatyBuilder.build(ops)

bot.use(ChatFlow(config))

bot.start()
  .then(() => log.info('Starter Bot Started.'))
  .catch((e: any) => log.error('bot运行异常：', JSON.stringify(e)))
