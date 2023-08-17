#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import 'dotenv/config.js'
import {
  log,
  WechatyBuilder,
} from 'wechaty'

import { ChatFlow, config, getBotOps } from '../src/chatflow.js'

// 构建机器人
const ops = getBotOps(config.botConfig.wechaty.puppet, config.botConfig.wechaty.token)
const bot = WechatyBuilder.build(ops)

bot.use(ChatFlow(config))
bot.start()
  .then(() => log.info('Starter Bot Started.'))
  .catch((e: any) => log.error('bot运行异常：', JSON.stringify(e)))
