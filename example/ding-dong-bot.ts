#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/* eslint-disable sort-keys */
import 'dotenv/config.js'
import {
  WechatyBuilder,
} from 'wechaty'
import { ChatFlow, getBotOps, log, logForm, ChatFlowConfig, WechatyConfig } from '../src/chatflow.js'
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

  if (!process.env.VIKA_SPACE_NAME || !process.env.VIKA_TOKEN) {
    log.error('维格表配置不全，.env文件或环境变量中设置的token和spaceName之后重启')
    return
  }

  const config: { wechatyConfig: WechatyConfig } | undefined = await ChatFlowConfig.init({
    spaceName: process.env.VIKA_SPACE_NAME || '',
    token: process.env.VIKA_TOKEN || '',
  })
  // log.info('vikaBot配置信息：', JSON.stringify(config, undefined, 2))

  if (config) {
    // 构建机器人
    const ops = getBotOps(config.wechatyConfig.puppet, config.wechatyConfig.token)

    const bot = WechatyBuilder.build(ops)

    bot.use(ChatFlow())
    bot.start()
      .then(() => logForm('1. 机器人启动，如出现二维码，请使用微信扫码登录\n\n2. 如果已经登录成功，则不会显示二维码\n\n3. 如未能成功登录访问 https://www.yuque.com/atorber/chatflow/ibnui5v8mob11d70 查看常见问题解决方法'))
      .catch((e: any) => log.error('机器人运行异常：', JSON.stringify(e)))
  } else {
    log.error('维格表配置不全，缺少puppet信息')
  }
}

void main()
