import { Contact, log } from 'wechaty'

/**
 * 登出事件
 */
async function onLogout (user:Contact) {

  log.info('logout，退出登录:', user)
  // job.cancel()

  // 退出登录后不关闭mqtt连接，否则会导致无法接收到消息
//   await setQrCode('qrcode', '6')
//   console.log(`用户${user}已登出`)
//   closeMqtt()
}
export default onLogout
