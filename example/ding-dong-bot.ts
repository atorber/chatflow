#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/* eslint-disable sort-keys */
import 'dotenv/config.js'

import {
  ChatFlow,
  getBotOps,
  ChatFlowOptions,
  WechatyBuilder,
  log,
} from '../src/index.js'
import * as path from 'path'

const main = async () => {
  log.info('开始启动机器人...')

  const dataDir = path.join(process.cwd(), '') // 数据目录
  const chatFlowConfig: ChatFlowOptions = {
    spaceId: process.env['VIKA_SPACE_ID'] || '',
    token: process.env['VIKA_TOKEN'] || '',
    adminRoomTopic: process.env['ADMINROOM_ADMINROOMTOPIC'] || '', // 管理群的topic，可选
    dataDir,
    endpoint: process.env['ENDPOINT'] || 'http://127.0.0.1:9503',// ChatFlow服务端地址，可选
  }

  const WECHATY_PUPPET = process.env['WECHATY_PUPPET'] || 'wechaty-puppet-wechat4u'
  const WECHATY_TOKEN = process.env['WECHATY_TOKEN'] || ''

  const ops = getBotOps(WECHATY_PUPPET, WECHATY_TOKEN) // 获取wechaty配置信息
  const bot = WechatyBuilder.build(ops)

  bot.use(ChatFlow(chatFlowConfig))
  bot.start()
    .then(() => log.info('1. 机器人启动，如出现二维码，请使用微信扫码登录\n\n2. 如果已经登录成功，则不会显示二维码\n\n3. 如未能成功登录访问 https://www.yuque.com/atorber/chatflow/ibnui5v8mob11d70 查看常见问题解决方法'))
    .catch((e: any) => log.error('机器人运行异常：' + JSON.stringify(e)))
}

void main()
