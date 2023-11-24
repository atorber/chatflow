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
  ChatFlowConfig,
  WechatyConfig,
  VikaDB,
  // LarkDB,
  IClientOptions,
  MqttProxy,
} from '../src/chatflow.js'

// import { spawn } from 'child_process'

// 监听进程退出事件，重新启动程序
// process.on('exit', (code) => {
//   if (code === 1) {
//     spawn('npm', [ 'run', 'start' ], {
//       stdio: 'inherit',
//     })
//   }
// })

const main = async () => {

  // 初始化数据表，可以选择Vika或Lark

  // 使用Vika
  await VikaDB.init({
    spaceName: process.env['VIKA_SPACE_NAME'],
    token: process.env['VIKA_TOKEN'],
  })

  // 使用Lark
  // await LarkDB.init({
  //   appId: process.env['LARK_APP_ID'],
  //   appSecret: process.env['LARK_APP_SECRET'],
  //   appToken: process.env['LARK_BITABLE_APP_TOKEN'],
  //   userMobile: process.env['LARK_APP_USER_MOBILE'],
  // })

  // 从配置文件中读取配置信息，包括wechaty配置、mqtt配置以及是否启用mqtt推送或控制
  const config: {
    mqttConfig: IClientOptions,
    wechatyConfig: WechatyConfig,
    mqttIsOn: boolean,
  } | undefined = await ChatFlowConfig.init() // 默认使用vika，使用lark时，需要传入'lark'参数await ChatFlowConfig.init('lark')
  // log.info('config', JSON.stringify(config, undefined, 2))
  if (config) {
    // 构建机器人
    const ops = getBotOps(config.wechatyConfig.puppet, config.wechatyConfig.token)

    const bot = WechatyBuilder.build(ops)

    // 如果MQTT推送或MQTT控制打开，则启动MQTT代理
    if (config.mqttIsOn) {
      log.info('启动MQTT代理...', JSON.stringify(config.mqttConfig))
      try {
        const mqttProxy = MqttProxy.getInstance(config.mqttConfig)
        if (mqttProxy) {
          mqttProxy.setWechaty(bot)
        }
      } catch (e) {
        log.error('MQTT代理启动失败，检查mqtt配置信息是否正确...', e)
      }
    }

    bot.use(ChatFlow())
    bot.start()
      .then(() => logForm('1. 机器人启动，如出现二维码，请使用微信扫码登录\n\n2. 如果已经登录成功，则不会显示二维码\n\n3. 如未能成功登录访问 https://www.yuque.com/atorber/chatflow/ibnui5v8mob11d70 查看常见问题解决方法'))
      .catch((e: any) => log.error('机器人运行异常：', JSON.stringify(e)))
  } else {
    logForm('维格表配置不全，缺少必要的配置信息')
  }
}

void main()
