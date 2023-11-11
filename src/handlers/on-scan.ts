import {
  ScanStatus,
  // types,
} from 'wechaty'

import qrcodeTerminal from 'qrcode-terminal'
import {
  // logger,
  logForm,
} from '../utils/mod.js'

import {
  MessageChat,
} from '../services/mod.js'

export async function onScan (qrcode: string, status: ScanStatus) {
  await MessageChat.init()
  if (status !== ScanStatus.Waiting && status !== ScanStatus.Timeout) {
    logForm('机器人启动，获取登录二维码失败' + `onScan:\n ${ScanStatus[status]}(${status})`)
    return
  }

  // 控制台显示二维码
  const qrcodeUrl = encodeURIComponent(qrcode)
  const qrcodeImageUrl = `https://wechaty.js.org/qrcode/${qrcodeUrl}`
  logForm(`机器人启动，使用手机微信扫描二维码登录\n\n如二维码显示不清晰可复制以下地址在浏览器打开:\n\n ${qrcodeImageUrl}`)
  qrcodeTerminal.generate(qrcode, { small: true })

  // 上传二维码到维格表，可通过扫码维格表中二维码登录
  await MessageChat.uploadQRCodeToVika(qrcode, status)

}

export default onScan
