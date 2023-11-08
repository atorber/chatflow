import {
  ScanStatus,
  // types,
} from 'wechaty'

import qrcodeTerminal from 'qrcode-terminal'
import { ChatFlowConfig } from '../api/base-config.js'
import {
  logger,
  logForm,
} from '../utils/mod.js'

import type {
  Services,
} from '../services/mod.js'

// 定义一个函数显示二维码在控制台
function displayQRCodeInConsole (qrcode: string, status: ScanStatus) {
  if (status !== ScanStatus.Waiting && status !== ScanStatus.Timeout) return

  const qrcodeUrl = encodeURIComponent(qrcode)
  const qrcodeImageUrl = `https://wechaty.js.org/qrcode/${qrcodeUrl}`
  logForm(`机器人启动，使用手机微信扫描二维码登录\n\n如二维码显示不清晰可复制以下地址在浏览器打开:\n\n ${qrcodeImageUrl}`)
  qrcodeTerminal.generate(qrcode, { small: true })  // 在控制台显示二维码
}

// 定义一个函数处理二维码上传
async function uploadQRCodeToVika (qrcode: string, status: ScanStatus) {
  try {
    await (ChatFlowConfig.services as Services).messageService.onScan(qrcode, status)
  } catch (error) {
    logger.error('上传二维码到维格表失败:', error)
  }
}

export async function onScan (qrcode: string, status: ScanStatus) {

  // 控制台显示二维码
  displayQRCodeInConsole(qrcode, status)

  // 上传二维码到维格表，可通过扫码维格表中二维码登录
  await uploadQRCodeToVika(qrcode, status)

  if (status !== ScanStatus.Waiting && status !== ScanStatus.Timeout) {
    logger.error('机器人启动，获取登录二维码失败', `onScan: ${ScanStatus[status]}(${status})`)
  }
}

export default onScan
