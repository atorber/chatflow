import onMessage from './handlers/on-message.js'
import { VikaBot } from './vika.js'

function WechatyVikaPlugin(config) {
  let vika = new VikaBot(config)
  return function (bot) {
    bot.on('message', async (msg) => {
      await onMessage(msg, vika)
    })
  }
}

export { WechatyVikaPlugin }

export default WechatyVikaPlugin
