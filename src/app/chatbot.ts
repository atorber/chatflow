/* eslint-disable sort-keys */
import { FileBox } from 'file-box'
import {
  Message,
  types,
  Wechaty,
  log,
} from 'wechaty'
import { formatSentMessage, logger } from '../utils/utils.js'
import axios from 'axios'
import { ChatFlowConfig } from '../index.js'
import type { ChatBotUser } from '../api/base-config.js'

axios.defaults.timeout = 60000

async function chatbot (message: Message) {
  const bot: Wechaty = ChatFlowConfig.bot
  const keyword = '@' + bot.currentUser.name()
  const text = extractKeyword(message, keyword)
  const talker = message.talker()
  const room = message.room()
  let answer: any = {}
  let chatBotUser:ChatBotUser | undefined

  try {
    if (room && message.text().indexOf(keyword) !== -1 && !message.self()) {
      log.info('当前群:' + JSON.stringify(room))
      const topic = await room.topic()
      chatBotUser = ChatFlowConfig.chatBotUsers.find((user:ChatBotUser) => {
        return user.room !== undefined && (user.room.id === room.id || user.room.topic === topic)
      })
      log.info('room智聊服务chatBotUser:' + JSON.stringify(chatBotUser))
    }

    if (!room) {
      log.info('当前用户:' + JSON.stringify(talker))
      const alias = await talker.alias()
      log.info('ChatFlowConfig.chatBotUsers:' + JSON.stringify(ChatFlowConfig.chatBotUsers, null, 2))
      chatBotUser = ChatFlowConfig.chatBotUsers.find((user:ChatBotUser) => {
        return user.contact !== undefined && (user.contact.id === talker.id || (user.contact.alias && user.contact.alias === alias) || user.contact.name === talker.name())
      })
      log.info('contact智聊服务chatBotUser:' + JSON.stringify(chatBotUser))
    }
  } catch (e) {
    logger.error('chatbot error:', e)
  }

  logger.info('智聊服务chatBotUser:' + JSON.stringify(chatBotUser))
  // log.info('当前用户或群:' + JSON.stringify(room) + JSON.stringify(talker))
  // log.info('智聊服务chatBotUser:' + JSON.stringify(chatBotUser))

  try {
    if (message.type() === types.Message.Text && chatBotUser !== undefined) {
      log.info('调用callGptbot...')
      answer = await callGptbot(text, chatBotUser)
      log.info('智聊回复消息：' + JSON.stringify(answer))
    } else {
      log.info('chatBotUser 为空，不调用callGptbot智聊服务...')
      return
    }

    if (answer.messageType && answer.text) {
      switch (answer.messageType) {
        case types.Message.Text:
          await sendMessage(answer.text, bot, message)
          break
        case types.Message.Image:
          await sendImage(answer, bot, message)
          break
        case types.Message.MiniProgram:
          await sendMiniProgram(answer, bot, message)
          break
      }
    }
  } catch (error) {
    logger.error('请求智聊服务 Error:', error)
    logger.error(`智聊查询内容，query: ${text}`)
  }
}

function extractKeyword (message: Message, keyword: string): string {
  const text = message.text()
  // 如果text以keyword开头或结尾，去除text开头或结尾的keyword，返回剩余的text
  if (text.startsWith(keyword) || text.endsWith(keyword)) {
    return text.replace(keyword, '').trim()
  }
  return text
}

async function sendMessage (text: string, bot: Wechaty, message: Message) {
  const formattedText = `${text}\n`
  const talker = message.talker()
  const room = message.room()
  if (room) {
    await room.say(formattedText, talker)
    await formatSentMessage(bot.currentUser, formattedText, undefined, room)
  } else {
    await message.say(formattedText)
    await formatSentMessage(bot.currentUser, formattedText, message.talker(), undefined)
  }
}

async function sendImage (answer: any, bot: Wechaty, message: Message) {
  const fileBox = FileBox.fromUrl(answer.text.url)
  const room = message.room()
  if (room) {
    await room.say(fileBox)
    await formatSentMessage(bot.currentUser, fileBox.toString(), undefined, room)
  } else {
    await message.say(fileBox)
    await formatSentMessage(bot.currentUser, fileBox.toString(), message.talker(), undefined)
  }
}

async function sendMiniProgram (answer: any, bot: Wechaty, message: Message) {
  const room = message.room()
  // ... (构建并发送MiniProgram的逻辑)
  const miniProgram = new bot.MiniProgram({
    appid: answer.text.appid,
    pagePath: answer.text.pagepath,
    // thumbUrl: answer.text.thumb_url,
    thumbKey: '42f8609e62817ae45cf7d8fefb532e83',
    thumbUrl: 'https://openai-75050.gzc.vod.tencent-cloud.com/openaiassets_afffe2516dac42406e06eddc19303a8d.jpg',
    title: answer.text.title,
  })

  if (room) {
    await room.say(miniProgram)
    await formatSentMessage(bot.currentUser, miniProgram.toString(), undefined, message.room())

  } else {
    await message.say(miniProgram)
    await formatSentMessage(bot.currentUser, miniProgram.toString(), message.talker(), undefined)
  }
}

async function callGptbot (query: any, chatBotUser:ChatBotUser) {
  const answer = {
    text:'',
  }

  try {
    const response = await axios.post(
      `${chatBotUser.chatbot.endpoint}/v1/chat/completions`,
      {
        model: chatBotUser.chatbot.model,  // 使用的模型
        messages: [
          { role: 'system', content: chatBotUser.chatbot.prompt || 'You are a helpful assistant.' },
          { role: 'user', content: query },
          // {role: 'assistant', content: 'The Los Angeles Dodgers won the World Series in 2020.'},
          // {role: 'user', content: 'Where was it played?'}
        ],  // 对话消息数组
      },
      {
        headers: {
          Authorization: `Bearer ${chatBotUser.chatbot.key}`,
          'Content-Type': 'application/json',
        },
      },
    )

    log.info('智聊gptbot Response:' + JSON.stringify(response.data))

    if (response.data.choices) {
      return {
        messageType: types.Message.Text,
        text: response.data.choices[0].message.content,
      }
    } else {
      return answer
    }
  } catch (error) {
    log.error('请求智聊服务gptbot Error:', error)
    logger.error(`查询内容，query: ${query}`)
    return answer

  }
}

export {
  chatbot,
}

export default chatbot
