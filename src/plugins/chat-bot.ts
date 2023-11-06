/* eslint-disable no-console */
/* eslint-disable sort-keys */
import { FileBox } from 'file-box'
import {
  Contact,
  Room,
  Message,
  log,
  types,
  Wechaty,
} from 'wechaty'
import { formatSentMessage } from '../utils/utils.js'
import type { configTypes } from '../types/mod.js'
import Api2d from 'api2d'
import openai from 'openai-sdk'
const {
  init,
  chat,
  // nlp,
} = openai

async function wxai (sysConfig: configTypes.Config, bot: Wechaty, talker: Contact, room: Room | undefined, message: Message) {
  const text = extractKeyword(message, bot.currentUser.name())

  let answer: any = {}
  if (message.type() === types.Message.Text) {
    answer = await aibot(sysConfig, talker, room, text)
  }

  console.debug('回复消息：', JSON.stringify(answer))

  if (isValidAnswer(answer)) {
    await handleAnswer(answer, bot, talker, room, message)
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

async function handleAnswer (answer: any, bot: Wechaty, talker: Contact, room: Room | undefined, message: Message) {
  switch (answer.messageType) {
    case types.Message.Text:
      await sendMessage(answer.text, bot, talker, room, message)
      break
    case types.Message.Image:
      await sendImage(answer, bot, room, message)
      break
    case types.Message.MiniProgram:
      await sendMiniProgram(answer, bot, room, message)
      break
  }
}

async function sendMessage (text: string, bot: Wechaty, talker: Contact, room: Room | undefined, message: Message) {
  const formattedText = `${text}\n`
  if (room) {
    await room.say(formattedText, talker)
    await formatSentMessage(bot.currentUser, formattedText, undefined, room)
  } else {
    await message.say(formattedText)
    await formatSentMessage(bot.currentUser, formattedText, message.talker(), undefined)
  }
}

async function sendImage (answer: any, bot: Wechaty, room: Room | undefined, message: Message) {
  const fileBox = FileBox.fromUrl(answer.text.url)
  if (room) {
    await room.say(fileBox)
    await formatSentMessage(bot.currentUser, fileBox.toString(), undefined, room)
  } else {
    await message.say(fileBox)
    await formatSentMessage(bot.currentUser, fileBox.toString(), message.talker(), undefined)
  }
}

async function sendMiniProgram (answer: any, bot: Wechaty, room: Room | undefined, message: Message) {
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

interface  QueryData {
  username:string;
  msg:string;
}

// aibot 函数基本保持不变
async function aibot (sysConfig: configTypes.Config, talker: any, room: any, query: any) {
  let answer = {}
  const roomid = room?.id
  const wxid = talker.id
  const nickName = talker.name()
  const topic = await room?.topic()
  log.info(`查询内容，query: ${query}`)
  const callBot = sysConfig.botConfig.autoQa.type

  const ops = {
    EncodingAESKey: sysConfig.botConfig.wxOpenAi.encodingAesKey,
    TOKEN: sysConfig.botConfig.wxOpenAi.token,
  }

  async function wxOpenAiRoutine () {
    log.info('开始请求微信对话平台...')
    init(ops)
    try {
      const queryData = prepareWxOpenAiParams(room, topic, nickName, wxid, roomid, query)
      log.info('username, userid', queryData)
      const resMsg:any = await chat(queryData)
      log.info(`回答内容： ${resMsg.msgtype}, ${resMsg.query}, ${resMsg.answer}`)
      return handleWxOpenAiResponse(resMsg)
    } catch (err) {
      log.error(`请求微信对话平台错误： ${err}`)
      return {}
    }
  }

  async function chatGptRoutine (content: string) {
    try {
      const timeout = 1000 * 60
      const api = new Api2d(sysConfig.botConfig.chatGpt.key, sysConfig.botConfig.chatGpt.endpoint, timeout)
      const body = prepareChatGptBody(content)
      log.info(`body: ${JSON.stringify(body)}`)
      const completion: any = await api.completion(body)
      const responseMessage = completion
      log.info(`responseMessage ${responseMessage}`)
      return {
        messageType: types.Message.Text,
        text: responseMessage.choices[0].message.content,
      }
    } catch (err) {
      console.error(err)
      return {}
    }
  }

  switch (callBot) {
    case 'wxOpenai':
      answer = await wxOpenAiRoutine()
      break
    case 'chatGpt':
      answer = await chatGptRoutine(query)
      break
    default:
      console.debug('没有匹配')
  }

  return answer
}

function prepareWxOpenAiParams (room:Room|undefined, topic:string, nickName:string, wxid:string, roomid:string, query: any) {
  const username = room ? `${nickName}|${wxid}/${topic}|${roomid}` : `${nickName}|${wxid}`
  const queryData:QueryData = {
    msg:query,
    username,
  }

  return queryData
}

function handleWxOpenAiResponse (resMsg: any) {
  let answer = {}
  if (resMsg.msgtype && resMsg.confidence > 0.8) {
    answer = prepareAnswerBasedOnMsgType(resMsg)
  }
  return answer
}

function prepareAnswerBasedOnMsgType (resMsg: any) {
  let answer = {}
  switch (resMsg.msgtype) {
    case 'text':
      answer = {
        messageType: types.Message.Text,
        text: resMsg.answer || resMsg.msg[0].content,
      }
      break
    case 'miniprogrampage':{
      const answerJsonMini = JSON.parse(resMsg.answer)
      answer = {
        messageType: types.Message.MiniProgram,
        text: answerJsonMini.miniprogrampage,
      }
      break
    }
    case 'image':{
      const answerJsonImage = JSON.parse(resMsg.answer)
      answer = {
        messageType: types.Message.Image,
        text: answerJsonImage.image,
      }
      break
    }
    // Add other cases here as needed
    default:
      log.info(JSON.stringify({ msg: '没有命中关键字' }))
  }
  return answer
}

function prepareChatGptBody (content: string) {
  return {
    model: 'gpt-3.5-turbo',
    messages: [ { role: 'user', content } ],
    temperature: 1,
    n: 1,
    stream: false,
  }
}

export class ChatBot {

  spaceName!: string
  msgStore!: any[]
  envsOnVika!: any[]
  switchsOnVika!: any[]
  reminderList!: any[]
  statisticsRecords: any

  constructor (config: any) {
    if (!config.token) {
      log.error('未配置token，请在config.ts中配置')
    } else if (!config.spaceName) {
      log.error('未配置空间名称，请在config.ts中配置')
    } else {
      this.spaceName = config.spaceName
      this.msgStore = []
    }
  }

}

export {
  wxai,
  aibot,
}

export default wxai
