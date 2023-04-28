import onMessage from '../handlers/on-message.js'
import onScan from '../handlers/on-scan.js'

import { VikaBot } from './vika.js'
import {
  configData,
  addChatMsg,
  sendMsg,
} from './im.js'
import { wxai } from './wxai.js'

import { ChatDevice } from './chat-device.js'
import { propertyMessage, eventMessage } from './msg-format.js'

function WechatyVikaPlugin (vika) {
  return function (bot) {
    bot.on('onScan', async (qrcode, status) => {
      await onScan(qrcode, status, vika)
    })
    bot.on('login', async () => {
      // await vika.checkInit('vika插件载入系统配置完成，系统启动成功~')
    })
    bot.on('message', async (msg) => {
      await onMessage(msg, vika)
    })
  }
}

export {
  WechatyVikaPlugin,
  VikaBot,
  configData,
  addChatMsg,
  sendMsg,
  wxai,
  ChatDevice,
  propertyMessage,
  eventMessage,
}

export default WechatyVikaPlugin
