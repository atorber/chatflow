import onMessage from './handlers/on-message.js'
import { VikaBot } from './vika.js'

function WechatyVikaPlugin (config) {
  const vika = new VikaBot(config)

  return function (bot) {
    bot.on('ready', async () => {
      await vika.checkInit()
    })
    bot.on('message', async (msg) => {
      await onMessage(msg, vika)
    })
  }
}

export { WechatyVikaPlugin }

export default WechatyVikaPlugin
