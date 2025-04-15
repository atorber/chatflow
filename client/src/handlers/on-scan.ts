import {
  ScanStatus,
  // types,
  log,
} from 'wechaty'

import qrcodeTerminal from 'qrcode-terminal'

import { uploadQRCodeToCloud } from '../api/message.js'

export async function onScan (qrcode: string, status: ScanStatus) {

  if (status !== ScanStatus.Waiting && status !== ScanStatus.Timeout) {
    log.info('机器人启动，获取登录二维码失败' + `onScan:\n ${ScanStatus[status]}(${status})`)
    return
  }

  // 控制台显示二维码
  const qrcodeUrl = encodeURIComponent(qrcode)
  const qrcodeImageUrl = `https://wechaty.js.org/qrcode/${qrcodeUrl}`
  log.info(`机器人启动，使用手机微信扫描二维码登录\n\n如二维码显示不清晰可复制以下地址在浏览器打开:\n\n ${qrcodeImageUrl}`)
  qrcodeTerminal.generate(qrcode, { small: true })

  // 上传二维码到维格表，可通过扫码维格表中二维码登录
  await uploadQRCodeToCloud(qrcode, status)
}

export default onScan
