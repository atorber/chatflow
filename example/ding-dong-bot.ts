#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/* eslint-disable sort-keys */
import 'dotenv/config.js'
import {
  WechatyBuilder,
} from 'wechaty'

import {
  ChatFlow,
  getBotOps,
  log,
  logForm,
  // LarkDB,
  GroupMaster,
  GroupMasterConfig,
  init,
} from '../src/chatflow.js'

const main = async () => {
  // 构建机器人
  const puppet = process.env['WECHATY_PUPPET']
  const token = process.env['WECHATY_TOKEN']

  const ops = getBotOps(puppet, token)
  const bot = WechatyBuilder.build(ops)

  await init({
    spaceName: process.env['VIKA_SPACE_NAME'],
    spaceId: process.env['VIKA_SPACE_ID'],
    token: process.env['VIKA_TOKEN'],
  }, bot)

  // 使用Lark
  // await LarkDB.init({
  //   appId: process.env['LARK_APP_ID'],
  //   appSecret: process.env['LARK_APP_SECRET'],
  //   appToken: process.env['LARK_BITABLE_APP_TOKEN'],
  //   userMobile: process.env['LARK_APP_USER_MOBILE'],
  // })

  // 如果配置了群管理秘书，则启动群管理秘书，这是一个探索性功能，暂未开放，可以忽略
  if (process.env['GROUP_MASTER_ENDPOINT']) {
    const configGroupMaster: GroupMasterConfig = {
      WX_KEY:process.env['GROUP_MASTER_WX_KEY'] || '',
      MQTT_ENDPOINT:process.env['GROUP_MASTER_MQTT_ENDPOINT'] || '',
      MQTT_USERNAME:process.env['GROUP_MASTER_MQTT_USERNAME'] || '',
      MQTT_PASSWORD:process.env['GROUP_MASTER_MQTT_PASSWORD'] || '',
      MQTT_PORT:Number(process.env['GROUP_MASTER_MQTT_PORT'] || '1883'),
      HOST:process.env['GROUP_MASTER_ENDPOINT'] || '',
    }
    bot.use(GroupMaster(configGroupMaster))
  }

  bot.use(ChatFlow())
  bot.start()
    .then(() => logForm('1. 机器人启动，如出现二维码，请使用微信扫码登录\n\n2. 如果已经登录成功，则不会显示二维码\n\n3. 如未能成功登录访问 https://www.yuque.com/atorber/chatflow/ibnui5v8mob11d70 查看常见问题解决方法'))
    .catch((e: any) => log.error('机器人运行异常：', JSON.stringify(e)))
}

void main()
