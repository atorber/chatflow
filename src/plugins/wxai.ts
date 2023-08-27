/* eslint-disable no-console */
/* eslint-disable sort-keys */
import {
  init,
  // chat,
  chatAibot,
  // nlp,
  // QueryData,
  genToken,
} from '../api/sdk/openai/index.js'

import { FileBox } from 'file-box'
// import excel2order from '../excel.js'

import {
  Contact,
  Room,
  Message,
  // ScanStatus,
  // WechatyBuilder,
  log,
  types,
  Wechaty,
} from 'wechaty'

import {
  // waitForMs as wait,
  formatSentMessage,
} from '../utils/utils.js'

import type { configTypes } from '../types/mod.js'

// import { ChatGPTAPI } from 'chatgpt'
import Api2d from 'api2d'
// import axios from 'axios'

// const __dirname = path.resolve()
// const userInfo = os.userInfo()
// const rootPath = `${userInfo.homedir}\\Documents\\WeChat Files\\`

async function wxai (sysConfig: configTypes.Config, bot: Wechaty, talker: Contact, room: Room | undefined, message: Message) {
  // const talker = message.talker()
  //   const roomid = room ? room.id : ''
  let text = message.text()
  const keyWord = bot.currentUser.name()

  if (text.indexOf(keyWord) !== -1 && text.length > 4) {
    const index = text.lastIndexOf(keyWord) + keyWord.length - 1
    text = text.substring(index + 1, text.length)
  }

  let answer: any = {}
  if (message.type() === types.Message.Text && room) {
    answer = await aibot(sysConfig, talker, room, text)
  }

  if (message.type() === types.Message.Text && !room) {
    answer = await aibot(sysConfig, talker, undefined, text)
  }

  // if (room && message.type() === types.Message.MiniProgram && !sysConfig.linkWhiteList.includes(talker.id)) {
  //   const miniProgram = await message.toMiniProgram()
  //   text = `${miniProgram.title()?.slice(0, 5)}是由群主或管理员所发布的小程序卡片消息吗？`
  //   answer = await aibot(sysConfig, talker, room, text)
  // }

  // if (room && message.type() === types.Message.Url && !sysConfig.linkWhiteList.includes(talker.id)) {
  //   const urllink = await message.toUrlLink()
  //   text = `${urllink.title().slice(0, 5)}是由群主或管理员所发布的小程序卡片消息吗？`
  //   answer = await aibot(sysConfig, talker, room, text)
  // }

  //   log.info(JSON.stringify(answer))
  console.debug('回复消息：', JSON.stringify(answer))

  if (answer.messageType && answer.text !== '请问你是想了解以下问题吗？') {
    switch (answer.messageType) {
      case types.Message.Text: {
        log.info(`向 ${talker.name()} 发送消息...`)

        if (room) {
          // answer = text.length > 20 ? (answer.text + '\n------------------------------\n' + talker.name() + ':' + text.slice(0, 10) + '...') : (answer.text + '\n------------------------------\n' + talker.name() + ':' + text)
          answer = answer.text + '\n'
          // console.debug(answer)
          await room.say(answer, ...[ talker ])
          await formatSentMessage(bot.currentUser, answer, undefined, room)

        } else {
          answer = answer.text + '\n'
          await message.say(answer)
          await formatSentMessage(bot.currentUser, answer, message.talker(), undefined)
        }

        break
      }
      case types.Message.Image: {
        const fileBox = FileBox.fromUrl(answer.text.url)

        if (room) {
          await room.say(fileBox)
          await formatSentMessage(bot.currentUser, fileBox.toString(), undefined, room)
        } else {
          await message.say(fileBox)
          await formatSentMessage(bot.currentUser, fileBox.toString(), message.talker(), undefined)
        }

        break
      }
      case types.Message.MiniProgram: {

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

        break
      }
      default: {
        break
      }

    }

  }

  // if (message.type() === types.Message.Image) {
  //   await wait(1000)
  //   try {
  //     const file = await message.toFileBox()
  //     log.info('image=====', file)
  //   } catch (err) {
  //     log.error('image=====', err)
  //   }

  // }

};

async function aibot (sysConfig: configTypes.Config, talker: any, room: any, query: any) {
  let answer = {}
  const roomid = room?.id
  const wxid = talker.id
  const nickName = talker.name()
  const topic = await room?.topic()
  log.info('查询内容，query:', query)
  const content = query
  const callBot = sysConfig.botConfig.autoQa.type
  const ops = {
    EncodingAESKey: sysConfig.botConfig.wxOpenAi.encodingAesKey,
    TOKEN: sysConfig.botConfig.wxOpenAi.token,
  }

  // log.info('微信对话平台配置信息：', JSON.stringify(ops))

  let answerJson
  switch (callBot) {
    case 'wxOpenai':
      log.info('开始请求微信对话平台...')
      init(ops)

      try {
        const username = room ? (nickName + '/' + topic) : nickName
        const userid = room ? (wxid + '/' + roomid) : wxid
        const signature = genToken({
          userid,
          username,
        })

        let queryData
        if (sysConfig.functionOnStatus.autoQa.customReply && room) {
          queryData = {
            first_priority_skills: [ topic || '' ],
            query,
            second_priority_skills: [ '通用问题' ],
            signature,
          }
        } else {
          queryData = {
            first_priority_skills: [ '通用问题' ],
            query,
            signature,
          }
        }

        const resMsg = await chatAibot(queryData)
        // console.debug(resMsg)
        // log.info('对话返回原始：', JSON.stringify(resMsg))
        // log.info('对话返回：', JSON.stringify(resMsg).replace(/[\r\n]/g, "").replace(/\ +/g, ""))
        log.info('回答内容：', resMsg.msgtype, resMsg.query, resMsg.answer)
        // console.debug(resMsg.query)
        // console.debug(resMsg.answer)

        if (resMsg.msgtype && resMsg.confidence > 0.8) {
          switch (resMsg.msgtype) {
            case 'text':
              answer = {
                messageType: types.Message.Text,
                text: resMsg.answer || resMsg.msg[0].content,
              }
              break
            case 'miniprogrampage':
              answerJson = JSON.parse(resMsg.answer)
              answer = {
                messageType: types.Message.MiniProgram,
                text: answerJson.miniprogrampage,
              }
              break
            case 'image':
              answerJson = JSON.parse(resMsg.answer)
              answer = {
                messageType: types.Message.Image,
                text: answerJson.image,
              }
              break
            case 'callback':
              if (resMsg.answer_type === 'text') {
                answer = {
                  messageType: types.Message.Text,
                  text: resMsg.answer,
                }
              }
              break
            case 'multimsg':
              answer = {
                messageType: types.Message.Text,
                text:JSON.parse(resMsg.answer).multimsg[0],
              }
              break
            default:
              log.info(JSON.stringify({ msg: '没有命中关键字', nickName, query, roomid, topic }))
              break
          }

          if (sysConfig.functionOnStatus.autoQa.customReply) {
            if (room && (resMsg.skill_name !== topic && resMsg.skill_name !== '通用问题')) {
              answer = {}
            }
          }
        }
      } catch (err) {
        log.error('请求微信对话平台错误：', err)
      }
      break
    case 'chatGpt':
      try {
        const timeout = 1000 * 60
        const api = new Api2d(sysConfig.botConfig.chatGpt.key, sysConfig.botConfig.chatGpt.endpoint, timeout)
        const body = {
          model: 'gpt-3.5-turbo',
          messages: [ { role: 'user', content } ],
          temperature: 1,
          n: 1,
          stream: false,
        }
        log.info('body:', JSON.stringify(body))
        const completion: any = await api.completion(body)
        const responseMessage = completion

        log.info('responseMessage', responseMessage)
        answer = {
          messageType: types.Message.Text,
          text: responseMessage.choices[0].message.content,
        }
      } catch (err) {
        console.error(err)
      }
      break
    default:
      console.debug('没有匹配')
      break
  }

  return answer

}

export {
  wxai,
  aibot,
}

export default wxai
