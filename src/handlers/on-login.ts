import type { Wechaty } from 'wechaty'
import { delay } from '../utils/utils.js'
import { onReadyOrLogin } from './onReadyOrLogin.js'

/**
 * 登录成功监听事件
 * @param {*} user 登录用户
 */
async function onLogin (this:Wechaty) {

  // ChatFlowCore.logger.info('onLogin,当前登录的账号信息:\n' + user.name())

  await delay(3000)

  // await updateConfig(configEnv)

  if ([ 'PuppetXp' ].includes(this.puppet.constructor.name)) await onReadyOrLogin(this)

}
export default onLogin
