#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import 'dotenv/config.js'
import {
  log,
  WechatyBuilder,
} from 'wechaty'

// import Koa from 'koa'
// import bodyParser from 'koa-bodyparser'

import { ChatFlow, config, getBotOps } from '../src/chatflow.js'

// 构建机器人
const ops = getBotOps(config.botConfig.wechaty.puppet, config.botConfig.wechaty.token)
const bot = WechatyBuilder.build(ops)

bot.use(ChatFlow(config))
bot.start()
  .then(() => log.info('\n\n1. 机器人启动，如出现二维码，请使用微信扫码登录\n\n2. 如果已经登录成功，则不会显示二维码\n\n================================'))
  .catch((e: any) => log.error('机器人运行异常：', JSON.stringify(e)))

// http服务
// const app = new Koa()
// app.use(bodyParser())

// app.listen(3000, () => {
//   log.info('Server is running on port 3000')
// })
