#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/* eslint-disable sort-keys */
/* eslint-disable no-console */
import 'dotenv/config.js'
import {
  ChatFlowConfig,
  WechatyConfig,
  VikaDB,
  // LarkDB,
  IClientOptions,
} from '../src/chatflow.js'
// import { getSetting } from '../src/api/setting.js'
import { getRoomList } from '../src/api/room.js'
import { getContactList } from '../src/api/contact.js'

import { MessageChat, ContactChat, RoomChat } from '../src/services/mod.js'

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
  // console.debug('VikaDB:', VikaDB)

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
  console.debug('config:', config)
  await MessageChat.init()
  //   const setting = await getSetting()
  //   console.debug('setting:', setting)
  await ContactChat.init()
  const contactList = await getContactList()
  console.debug('contactList:', contactList)

  await RoomChat.init()
  const roomList = await getRoomList()
  console.debug('roomList:', roomList)

}

void main()
