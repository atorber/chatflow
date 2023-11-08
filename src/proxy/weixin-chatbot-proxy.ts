/* eslint-disable sort-keys */
import { FileBox } from 'file-box'
import {
  Room,
  Message,
  log,
  types,
  Wechaty,
} from 'wechaty'
import { formatSentMessage, logger } from '../utils/utils.js'
import type { ProcessEnv } from '../types/mod.js'
import openai from 'openai-sdk'
const {
  init,
  chat,
  // nlp,
} = openai

async function wxai (sysConfig: ProcessEnv, bot: Wechaty, message: Message) {
  const text = extractKeyword(message, bot.currentUser.name())
  const talker = message.talker()
  const room = message.room()
  let answer: any = {}
  if (message.type() === types.Message.Text) {
    answer = await aibot(sysConfig, talker, room, text)
  }

  log.info('回复消息：', JSON.stringify(answer))

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
  const talker = message.talker()
  const room = message.room()
  const formattedText = `${text}\n`
  if (room) {
    await room.say(formattedText, talker)
    await formatSentMessage(bot.currentUser, formattedText, undefined, room)
  } else {
    await message.say(formattedText)
    await formatSentMessage(bot.currentUser, formattedText, message.talker(), undefined)
  }
}

async function sendImage (answer: any, bot: Wechaty, message: Message) {
  const room = message.room()
  const fileBox = FileBox.fromUrl(answer.text.url)
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

interface  QueryData {
  username:string;
  msg:string;
}

// aibot 函数基本保持不变
async function aibot (sysConfig: ProcessEnv, talker: any, room: any, query: any) {
  let answer = {}
  const roomid = room?.id
  const wxid = talker.id
  const nickName = talker.name()
  const topic = await room?.topic()
  logger.info(`查询内容，query: ${query}`)

  const ops = {
    EncodingAESKey: sysConfig.WXOPENAI_ENCODINGAESKEY,
    TOKEN: sysConfig.WXOPENAI_TOKEN,
  }

  async function wxOpenAiRoutine () {
    logger.info('开始请求微信对话平台...')
    init(ops)
    try {
      const queryData = prepareWxOpenAiParams(room, topic, nickName, wxid, roomid, query)

      const resMsg:any = await chat(queryData)

      logger.info(`对话平台返回内容： ${JSON.stringify(resMsg)}`)
      logger.info(`回答内容： ${resMsg.msgtype}, ${resMsg.query}, ${resMsg.answer}`)
      return handleWxOpenAiResponse(resMsg)
    } catch (err) {
      logger.error(`请求微信对话平台错误： ${err}`)
      return {}
    }
  }

  answer = await wxOpenAiRoutine()

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
  // 置信度大于0.8时回复，低于0.8时不回复
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
      logger.info(JSON.stringify({ msg: '没有命中关键字' }))
  }
  return answer
}

export {
  wxai,
  aibot,
}

export default wxai
