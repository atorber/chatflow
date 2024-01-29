#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/* eslint-disable sort-keys */
import 'dotenv/config.js'
import {
  WechatyBuilder,
} from 'wechaty'

import { getBotOps, log, logForm, GroupMaster, GroupMasterConfig } from '../src/chatflow.js'

const main = async () => {

  const puppet = process.env['WECHATY_PUPPET']
  const token = process.env['WECHATY_TOKEN']

  const config: GroupMasterConfig = {
    WX_KEY:process.env['GROUP_MASTER_WX_KEY'] || '',
    MQTT_ENDPOINT:process.env['GROUP_MASTER_MQTT_ENDPOINT'] || '',
    MQTT_USERNAME:process.env['GROUP_MASTER_MQTT_USERNAME'] || '',
    MQTT_PASSWORD:process.env['GROUP_MASTER_MQTT_PASSWORD'] || '',
    MQTT_PORT:Number(process.env['GROUP_MASTER_MQTT_PORT'] || '1883'),
    HOST:process.env['GROUP_MASTER_ENDPOINT'] || '',
  }
  // 构建机器人
  const ops = getBotOps(puppet, token)

  const bot = WechatyBuilder.build(ops)

  bot.use(GroupMaster(config))
  bot.start()
    .then(() => logForm('1. 机器人启动，如出现二维码，请使用微信扫码登录\n\n2. 如果已经登录成功，则不会显示二维码\n\n3. 如未能成功登录访问 https://www.yuque.com/atorber/chatflow/ibnui5v8mob11d70 查看常见问题解决方法'))
    .catch((e: any) => log.error('机器人运行异常：', JSON.stringify(e)))
}

void main()
