import { onReadyOrLogin } from './onReadyOrLogin.js'
// import { delay } from '../utils/utils.js'
import { Wechaty, log } from 'wechaty'

/**
 * 准备好的事件
 */
async function onReady (this:Wechaty) {
  try {
    // const user: Contact = bot.currentUser
    // logger.info('onReady,当前登录的账号信息:\n' + user.name())
    // await delay(1000)
    // await updateConfig(configEnv)

    if (![ 'PuppetXp' ].includes(this.puppet.constructor.name)) await onReadyOrLogin(this)
  } catch (e) {
    log.info('on ready error:', e)
  }
}
export default onReady
