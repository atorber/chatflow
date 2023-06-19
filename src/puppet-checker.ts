#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable no-console */
/* eslint-disable eqeqeq */
/* eslint-disable camelcase */
/* eslint-disable sort-keys */
import 'dotenv/config.js'

import type { types as configTypes } from './mods/mod.js'

import {
  Contact,
  // Room,
  Message,
  ScanStatus,
  WechatyBuilder,
  log,
  // types,
} from 'wechaty'

import qrcodeTerminal from 'qrcode-terminal'
import WechatyVikaPlugin from './plugins/index.js'

import { baseConfig } from './config.js'
import { VikaBot } from './plugins/vika.js'

let bot: any
let sysConfig: configTypes.SysConfig

if (process.env['VIKA_SPACENAME']) {
  baseConfig['VIKA_SPACENAME'] = process.env['VIKA_SPACENAME']
}

if (process.env['VIKA_TOKEN']) {
  baseConfig['VIKA_TOKEN'] = process.env['VIKA_TOKEN']
}

const vikaConfig = {
  spaceName: baseConfig['VIKA_SPACENAME'],
  token: baseConfig['VIKA_TOKEN'],
}
// console.debug(vikaConfig)
const vika = new VikaBot(vikaConfig)

async function getConfig (vika: any) {
  sysConfig = await vika.getConfig()
  console.debug(sysConfig)
  return sysConfig
}

async function main () {
  const isReady = await vika.checkInit('主程序载入系统配置成功，等待插件初始化...')

  if (!isReady) {
    return
  }
  // 获取系统配置信息
  await getConfig(vika)

  const wechatyConfig: any = {
    // 网页版微信
    'wechaty-puppet-wechat': {
      name: 'openai-qa-bot',
      puppet: 'wechaty-puppet-wechat',
      puppetOptions: {
        uos: true,
      },
    },
    // Windows桌面版微信
    'wechaty-puppet-xp': {
      name: 'openai-qa-bot',
      puppet: 'wechaty-puppet-xp',
    },
    // pad-local
    'wechaty-puppet-padlocal': {
      name: 'openai-qa-bot',
      puppet: 'wechaty-puppet-padlocal',
      puppetOptions: {
        token: sysConfig.puppetToken,
      },
    },
    // wechaty-puppet-service
    'wechaty-puppet-service': {
      name: 'openai-qa-bot',
      puppet: 'wechaty-puppet-service',
      puppetOptions: {
        token: sysConfig.puppetToken,
      },
    },
  }

  const ops = wechatyConfig[sysConfig.puppetName]
  console.debug(ops)

  bot = WechatyBuilder.build(ops)

  async function onScan (qrcode: string, status: ScanStatus) {
    console.debug(qrcode)
    if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
      const qrcodeUrl = encodeURIComponent(qrcode)

      const qrcodeImageUrl = [
        'https://wechaty.js.org/qrcode/',
        qrcodeUrl,
      ].join('')
      log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)

      qrcodeTerminal.generate(qrcode, { small: true })  // show qrcode on console

    } else {
      log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
    }
  }

  async function onLogin (user: Contact) {
    log.info('StarterBot', '%s login', user.payload)
    await user.say('上线：' + new Date().toLocaleString())
    log.info(JSON.stringify(user.payload))

    console.log('================================================\n\n登录启动成功，程序准备就绪\n\n================================================\n')
  }

  function onLogout (user: Contact) {
    log.info('StarterBot', '%s logout', user)
  }

  async function onMessage (message: Message) {

    log.info('onMessage', JSON.stringify(message))
    console.debug('onMessage', JSON.stringify(message))

  }

  async function roomJoin (room: { topic: () => any; id: any; say: (arg0: string, arg1: any) => any }, inviteeList: any[], inviter: any) {
    const nameList = inviteeList.map(c => c.name()).join(',')
    log.info(`Room ${await room.topic()} got new member ${nameList}, invited by ${inviter}`)
  }

  const missingConfiguration = []

  for (const key in baseConfig) {
    if (!baseConfig[key] && ![ 'imOpen', 'DIFF_REPLY_ONOFF' ].includes(key)) {
      missingConfiguration.push(key)
    }
  }

  if (missingConfiguration.length === 0) {
    bot.use(
      WechatyVikaPlugin(vika),
    )
    bot.on('scan', onScan)
    bot.on('login', onLogin)
    bot.on('logout', onLogout)
    bot.on('message', onMessage)
    bot.on('room-join', roomJoin)

    bot.start()
      .then(() => log.info('Starter Bot Started.'))
      .catch((e: any) => log.error(JSON.stringify(e)))

  } else {
    log.error('\n======================================\n\n', `错误提示：\n缺少${missingConfiguration.join()}配置参数,请检查config.js文件\n\n======================================`)
    log.info('baseConfig:', baseConfig)
  }

}

void main()
