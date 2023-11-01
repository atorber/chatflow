#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/* eslint-disable sort-keys */
import 'dotenv/config.js'
import {
  log,
  WechatyBuilder,
} from 'wechaty'

// import Koa from 'koa'
// import bodyParser from 'koa-bodyparser'

import { ChatFlow, getBotOps } from '../src/chatflow.js'
import { logForm } from '../src/utils/utils.js'
import {
  VikaBot,
} from '../src/db/vika-bot.js'

// 构建机器人
const ops = getBotOps(process.env.WECHATY_PUPPET, process.env.WECHATY_TOKEN)
const bot = WechatyBuilder.build(ops)

const initializeVika = async () => {
  const vikaBot = new VikaBot({
    spaceName: process.env.VIKA_SPACE_NAME || '',
    token: process.env.VIKA_TOKEN || '',
  })
  try {
    await vikaBot.init()
    return vikaBot
  } catch {
    return undefined
  }
}

const vikaBot: VikaBot|undefined = await initializeVika()
// log.info('vikaBot配置信息：', JSON.stringify(vikaBot, undefined, 2))

if (vikaBot) {
  bot.use(ChatFlow(vikaBot))
  bot.start()
    .then(() => logForm('1. 机器人启动，如出现二维码，请使用微信扫码登录\n\n2. 如果已经登录成功，则不会显示二维码\n\n3. 如未能成功登录访问 https://www.yuque.com/atorber/chatflow/ibnui5v8mob11d70 查看常见问题解决方法'))
    .catch((e: any) => log.error('机器人运行异常：', JSON.stringify(e)))
}

// http服务
// const app = new Koa()
// app.use(bodyParser())

// app.listen(3000, () => {
//   log.info('Server is running on port 3000')
// })
