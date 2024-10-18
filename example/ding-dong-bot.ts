#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/* eslint-disable sort-keys */
import 'dotenv/config.js'

import {
  ChatFlow,
  getBotOps,
  logForm,
  init,
  CloudConfig,
  ChatFlowOptions,
  WechatyBuilder,
  log,
} from '../src/index.js'
import * as path from 'path'

const main = async () => {
  log.info('开始启动机器人...')
  const VIKA_SPACE_ID = process.env['VIKA_SPACE_ID']||''
  const VIKA_TOKEN = process.env['VIKA_TOKEN']||''
  const ADMINROOM_ADMINROOMTOPIC = process.env['ADMINROOM_ADMINROOMTOPIC']||'' // 管理群的topic，可选
  const dataDir = path.join(process.cwd(), '') // 数据目录
  const endpoint = process.env['ENDPOINT'] // ChatFlow服务端地址，可选

  const chatFlowConfig:ChatFlowOptions = {
    spaceId: VIKA_SPACE_ID,
    token: VIKA_TOKEN,
    adminRoomTopic: ADMINROOM_ADMINROOMTOPIC,
    dataDir,
    endpoint,
  } // ChatFlow配置信息

  let config: CloudConfig | undefined
  // 初始化检查数据库表，如果不存在则创建
  try {
    config = await init(chatFlowConfig)
    log.info('初始化检查成功：', JSON.stringify(config))
  } catch (e) {
    logForm('初始化检查失败：' + JSON.stringify(e))
    throw e
  }

  if (!config) {
    throw new Error('初始化检查失败')
  } else {
    // 从环境变量中获取配置信息, 在环境变量中已经配置了以下信息或者直接赋值
    const WECHATY_PUPPET = process.env['WECHATY_PUPPET'] ? process.env['WECHATY_PUPPET'] : (config.wechatyConfig.puppet || 'wechaty-puppet-wechat4u')
    const WECHATY_TOKEN = process.env['WECHATY_TOKEN'] ? process.env['WECHATY_TOKEN'] : (config.wechatyConfig.token || '')

    // 构建wechaty机器人
    const ops = getBotOps(WECHATY_PUPPET, WECHATY_TOKEN) // 获取wechaty配置信息
    const bot = WechatyBuilder.build(ops)

    // 启用ChatFlow插件
    bot.use(ChatFlow(chatFlowConfig))

    // 启动机器人
    bot.start()
      .then(() => logForm('1. 机器人启动，如出现二维码，请使用微信扫码登录\n\n2. 如果已经登录成功，则不会显示二维码\n\n3. 如未能成功登录访问 https://www.yuque.com/atorber/chatflow/ibnui5v8mob11d70 查看常见问题解决方法'))
      .catch((e: any) => logForm('机器人运行异常：' + JSON.stringify(e)))
  }
}

void main()
