/* eslint-disable no-console */
/* eslint-disable sort-keys */
import { FileBox } from 'file-box'
import {
  Message,
  types,
  Wechaty,
} from 'wechaty'
import { formatSentMessage, logger } from '../utils/utils.js'
import type { ProcessEnv } from '../types/mod.js'
import axios from 'axios'

/**
 * 使用 AK，SK 生成鉴权签名（Access Token）
 * @return string 鉴权签名信息（Access Token）
 */
async function getAccessToken (sysConfig:ProcessEnv) {
  const AK = sysConfig.ERNIE_AK
  const SK = sysConfig.ERNIE_SK
  const options = {
    method: 'POST',
    url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + AK + '&client_secret=' + SK,
  }
  const apiUrl = options.url
  const payload = {}

  try {
    const response = await axios.post(apiUrl, payload)
    logger.info('access_token:', JSON.stringify(response.data))
    return response.data.access_token
  } catch (error) {
    console.error(error)
    return  undefined
  }
}

export async function getFormattedRideInfo (message:Message) {
  let text: string = message.text()
  const name:string = message.talker().name()
  const apiUrl = 'https://openai.api2d.net/v1/chat/completions'
  const headers = {
    Authorization: 'Bearer xxxx', // <-- 把 fkxxxxx 替换成你自己的 Forward Key，注意前面的 Bearer 要保留，并且和 Key 中间有一个空格。
    'Content-Type': 'application/json',
  }
  text = `从"发布人：${name}\n信息：${text}"中提取出:类型（人找车、车找人）、出发地、目的地、出发日期、出发时间、联系电话、发布人、车费、途经路线,不要输出任何其他的描述`
  const payload = {
    messages: [ { content: text, role: 'user' } ],
    model: 'gpt-3.5-turbo',
  }

  try {
    const response = await axios.post(apiUrl, payload, { headers })
    logger.info('顺风车信息检测结果：', JSON.stringify(response.data))
    return response.data
  } catch (error) {
    console.error(error)
    return  undefined
  }
}

async function ernie (sysConfig: ProcessEnv, bot: Wechaty, message: Message) {
  const text = extractKeyword(message, bot.currentUser.name())
  // const talker = message.talker()
  // const room = message.room()
  let answer: any = {}
  if (message.type() === types.Message.Text) {
    answer = await aibot(sysConfig, text)
  }

  console.debug('回复消息：', JSON.stringify(answer))

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

async function chatGptRoutine (sysConfig:ProcessEnv, query: string) {
  const answer = {
    text:'',
  }
  try {

    const options = {
      method: 'POST',
      url: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro?access_token=' + await getAccessToken(sysConfig),
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role:'user', content: query },
        ],
      }),
    }
    const responseMessage = await axios.post(options.url, options.body, { headers:options.headers })
    console.log(responseMessage.data)
    logger.info('gptbot responseMessage:\n', JSON.stringify(responseMessage))

    if (responseMessage.data.result) {
      return {
        messageType: types.Message.Text,
        text: responseMessage.data.result,
      }
    } else {
      return answer
    }

  } catch (err) {
    console.error(err)
    return answer
  }
}

// aibot 函数基本保持不变
async function aibot (sysConfig: ProcessEnv, query: any) {
  logger.info(`查询内容，query: ${query}`)

  const answer = await chatGptRoutine(sysConfig, query)

  return answer
}

export function prepareChatGptBody (content: string) {
  return {
    model: process.env['CHATGPT_MODEL'],
    messages: [ { role: 'user', content } ],
    temperature: 1,
    n: 1,
    stream: false,
  }
}

export {
  ernie,
  aibot,
}

export default ernie
