import onMessage from './handlers/on-message.js'

function WechatyVikaPlugin() {
  return function (bot) {
    bot.on('message', onMessage)
  }
}

export { WechatyVikaPlugin }

export default WechatyVikaPlugin
