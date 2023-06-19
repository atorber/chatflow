#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/**
 * Wechaty - Conversational RPA SDK for Chatbot Makers.
 *  - https://github.com/wechaty/wechaty
 */
// https://stackoverflow.com/a/42817956/1123955
// https://github.com/motdotla/dotenv/issues/89#issuecomment-587753552
import 'dotenv/config.js'

import {
  Contact,
  Message,
  ScanStatus,
  types,
  WechatyBuilder,
  log,
}                  from 'wechaty'

import qrcodeTerminal from 'qrcode-terminal'
import Api2d from 'api2d'
import fs from 'fs'

// 设置白名单
let whitelist = new Set<string>()
const whitelistPath = 'src/plugins/whitelist.json'

// 从文件中读取白名单
if (fs.existsSync(whitelistPath)) {
  const data = fs.readFileSync(whitelistPath, { encoding: 'utf-8' })
  whitelist = new Set(JSON.parse(data || '[]'))
}

// 定时保存白名单到文件
setInterval(() => {
  const data = JSON.stringify([ ...whitelist ])
  fs.writeFileSync(whitelistPath, data, { encoding: 'utf-8' })
}, 5000)

/**
 * @param {string} messages
 * @returns {string}
 */
async function getChatGPTReply (message: string) {
  const systemPrompt = '你是一个翻译器，用户将输入{"text":"你要翻译的内容..."}，你只需要翻译text对应的value内容。如果输入的是中文你翻译成英文，如果输入的是英文你翻译成中文。例如输入是：{"text":"你是谁"}，你的回到是：who are you（只返回翻译结果，而不是返回{"text":"who are you"}格式）'
  const apiKey = process.env['OPENAI_API_KEY'] || 'your key'
  // const apiEndpoint = 'https://api.openai.com'
  const apiEndpoint = 'https://api.openai-proxy.com'
  try {
    const api = new Api2d(apiKey, apiEndpoint, 60 * 1000)
    const body = {
      max_tokens:2048,
      messages:[
        { content:systemPrompt, role:'system' },
        { content:`{"text":"${message}"}`, role:'user' },
      ],
      model: 'gpt-3.5-turbo',
      n: 1,
      stream: false,
      temperature: 1,
    }
    log.info('body:', JSON.stringify(body))
    const completion: any = await api.completion(body)
    const responseMessage = completion
    return responseMessage.choices[0].message.content
  } catch (err) {
    console.error(err)
    return '发生了一些错误，请稍后再试~'
  }
}

function onScan (qrcode: string, status: ScanStatus) {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    const qrcodeImageUrl = [
      'https://wechaty.js.org/qrcode/',
      encodeURIComponent(qrcode),
    ].join('')
    log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)

    qrcodeTerminal.generate(qrcode, { small: true })  // show qrcode on console

  } else {
    log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
  }
}

function onLogin (user: Contact) {
  log.info('StarterBot', '%s login', user)
}

function onLogout (user: Contact) {
  log.info('StarterBot', '%s logout', user)
}

async function onMessage (message: Message) {
  log.info('onMessage', JSON.stringify(message))
  const type = message.type()
  const text = message.text()
  const room = message.room()

  if (!room) {
    return
  }

  const roomId = room.id

  const mentionSelf = await message.mentionSelf()

  if (type === types.Message.Text && mentionSelf) {
    const mentionText = text.replace(`@${bot.currentUser.name()}`, '').trim()

    if (mentionText === '#开启互译') {
      if (whitelist.has(roomId)) {
        log.info(`群"${await room.topic()}"已在白名单中，无需重复添加`)
        await message.say('已在白名单中，无需重复添加')
      } else {
        whitelist.add(roomId)
        log.info(`已将群"${await room.topic()}"加入到白名单`, JSON.stringify(whitelist))
        await message.say('已开启双语互译')
      }
    } else if (mentionText === '#关闭互译') {
      if (whitelist.has(roomId)) {
        whitelist.delete(roomId)
        log.info(`已将群"${await room.topic()}"从白名单中移除`)
        await message.say('已关闭双语互译')
      } else {
        log.info(`群"${await room.topic()}"不在白名单中，无需移除`)
        await message.say('未开启双语互译，无需关闭')
      }
    }
  }

  if (type === types.Message.Text && whitelist.has(roomId)) {
    log.info(`收到来自群"${await room.topic()}"的文本消息："${text}"`)
    try {
      const reply = await getChatGPTReply(text)
      await message.say(reply)
    } catch (err) {
      log.error('err', err)
    }
  }
}

const bot = WechatyBuilder.build({
  name: 'ding-dong-bot',
  puppet: 'wechaty-puppet-xp',
})

bot.on('scan',    onScan)
bot.on('login',   onLogin)
bot.on('logout',  onLogout)
bot.on('message', onMessage)

bot.start()
  .then(() => log.info('StarterBot', 'Starter Bot Started.'))
  .catch(e => log.error('StarterBot', e))
