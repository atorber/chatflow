/* eslint-disable sort-keys */
import { FileBox } from 'file-box'
import {
  Message,
  types,
  Wechaty,
} from 'wechaty'
import { formatSentMessage, logger } from '../utils/utils.js'
import type { ProcessEnv } from '../types/mod.js'
import axios from 'axios';
axios.defaults.timeout = 60000

async function gpt (sysConfig: ProcessEnv, bot: Wechaty, message: Message) {
  const text = extractKeyword(message, bot.currentUser.name())
  // const talker = message.talker()
  // const room = message.room()
  let answer: any = {}
  if (message.type() === types.Message.Text) {
    answer = await aibot(sysConfig, text)
  }

  logger.info('回复消息：', JSON.stringify(answer))

  if (isValidAnswer(answer)) {
    await handleAnswer(answer, bot, message)
  }
}

function extractKeyword (message: Message, keyword: string): string {
  const text = message.text()
  if (text.indexOf(keyword) !== -1 && text.length > 4) {
    const index = text.lastIndexOf(keyword) + keyword.length - 1
    return text.substring(index + 1, text.length)
  }
  return text
}

function isValidAnswer (answer: any): boolean {
  return answer.messageType && answer.text !== '请问你是想了解以下问题吗？'
}

async function handleAnswer (answer: any, bot: Wechaty, message: Message) {
  // const talker = message.talker()
  // const room = message.room()
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

// aibot 函数基本保持不变
async function aibot (sysConfig: ProcessEnv, query: any) {
  let answer = {
    text:'',
  }

  try {
    const response = await axios.post(
      `${sysConfig.CHATGPT_ENDPOINT}/v1/chat/completions`,
      {
        model: sysConfig.CHATGPT_MODEL,  // 使用的模型
        messages: [
          // {role: 'system', content: 'You are a helpful assistant.'},
          {role: 'user', content: query},
          // {role: 'assistant', content: 'The Los Angeles Dodgers won the World Series in 2020.'},
          // {role: 'user', content: 'Where was it played?'}
        ]  // 对话消息数组
      },
      {
        headers: {
          'Authorization': `Bearer ${sysConfig.CHATGPT_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    logger.info('gpt Response:' + JSON.stringify(response.data));

    if (response.data.choices) {
      return {
        messageType: types.Message.Text,
        text: response.data.choices[0].message.content,
      }
    } else {
      return answer
    }
  } catch (error) {
    logger.error('请求gpt Error:', error);
    logger.error(`查询内容，query: ${query}`)
    return answer

  }
}

export function prepareChatGptBody (content: string) {
  return {
    model: process.env['CHATGPT_MODEL'],
    prompt: content,
    temperature: 0.7,
    // n: 1,
    // stream: false,
  }
}

export {
  gpt,
  aibot,
}

export default gpt
