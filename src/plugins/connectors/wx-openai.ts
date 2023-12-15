/* eslint-disable no-console */
/* eslint-disable sort-keys */
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

import path from 'path'
// import os from 'os'

import {
  delay,
  formatSentMessage,
} from '../../utils/utils.js'

import { ChatGPTAPI } from 'chatgpt'
import * as openai from '../../utils/openai-sdk/index.js'
const {
  init,
  chat,
  // nlp,
} = openai

interface  QueryData {
  username:string;
  msg:string;
}

const botTpyes = [ 'WxOpenai', 'ChatGPT' ]
const useBot = 0
const callBot = botTpyes[useBot]

const config = {
  AutoReply: true,
  MakeFriend: true,
  ChatGPTSessionToken: 'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..IMz6n01YT2ZrlL-c.ZRM6h_EhsvDTKBsfJv2l8pkCiQKaZ_-QdrvyJFUVsydnfs8QvgtxScpCfCzSNtPbo4SG9am5miwWQmseRyTjNoN3pNhGnWWWSc3FMNb1w9Ok_fbUokUf_H2YjcuAMqYpsb0YPieykFznAEiWwqdnpOHkvrxIVr2J71NTGzgBQ805oJXey92r-_btktR-uSaI5vhLQxoOBabSAcRCuEPG0k7_ChsaXd8p932UOzFeyAeh26xDock6-baLLYNbJ6nrQmnfx0nc-MjBEWU1wYXgfVqReeM_W_zRKM9rL0KsVg7GpuL5k_oiNUYpm1iEvbEfEFOhhK6zzR_j8awZ_qKEbVQRkuo9gH-OaLAEPib0kwTrwirbF2rOiiaLA9AE-nEQoQZ5CKkrRMGploFjx0sGXwmqrjNh1IzuVgf11NmHUCNYW-TweOdWo_3Wge1jjRUkamShFGYL478zK6Ve5BgyQZ3MZD5aAof6hWL8ELFu0THDio8cQUMQNP7RoBpQAFSLud1nyB4L5VB9BRafAClstO5Tn50o3obGtVY_mMl5WwFOTsofHutEiXhbP2JeuGAruwKdE5Ks8l5VEuv-36r7-5utIcvoBnJhXuyZaNq4xdyOf4rdXQDUNcI6wS9YR4AKOyCJKHiZ91RuxTR5Tx9Tz8JWCZAYzP3HJNh9ql6wjFSytqdDj2QbD1yDctlY4juzcp_4SiE0yJDrBkRgZ6u734FM_zJJeqGjpbn88rZ_ItXfJjGjXXP8ifSjZfSd4W1UuVxE8XH67BiRbd9d2m8nOPfnELhepIK14ICMnDhyZ-_m7j25I54yyj5ISKojC6noZMvh4KKjlqH7ASAKUBcGoMsk66L9D_6zymE7NrPTy9gRMsbVF5G6-YDAQ0FfWdA8b6jVFDLVvILprPoQzdWCUuY2XDLJ8-MBEEC_sGryLAR01DX3xuMPDBzA6cC8zUAqK-tZvJefL0s7Nv40ABdDhsUIa3EsNe1qJigw-53GeTSqkdO4QihyW3LTXX6QK7BDBA6IJJ5Ry5jYAvS-RvnjXE7hCqYygNuwXbmWZJZ4xLwYmc6iDDgrg8nxfwdq8i3WKFI4EA45afKLuzJTyUQzZAEoQonqVKReqAA1rCRLyuhbgzTi01TuOI6ncCVsOJR_mSdT3QDsZODhRDVjbDpBigyAMVpOEuIiSEwew4B3iP1dsudNoPpqGJKo3-8zwVHN9NZrlm0mnuFvcX5nRN4APl6n6TJAyQ-_dJS0ibi-bTuwlOGvXXxXaguSzgrNSyqVHetuOEp7k7bkOfTrkqEP0TH4xL5Hl5dqsv-KmbBHrj1bkfTd-2NKnBaSZyajflW2Kyx8MBnu9cEVeGNt6RpuITB9CE83ZEL-W99oEpURkCdc64x546PSNUnRuyDTphpfIHCFCqt5yoXg13i82x9EfF88ERdj1FDV-gSsOJoGB_hqI5gJkM3ch6qVDwye4pQAGMDaViTOesPLghlbjoCskQ-cTHHUPdiHfxZ3fW8bdhG1KanR5oJ6E00t7b9eKlfzzScmmr4fDqErV1FZX-F6EnaoqeoX5Caai7AE9TmPNu8XNNDR5k7pzHzpCErryQWHrSo6KSK_1cirncKNcGl0AeX2CwtgDolmPnvHcUmZT_aLW6dbiqmtX5ZWeVNoB6qpbR6d5zwMcSL-NNCqwj6q1CLakHpUgepka5n1Si64jb-9ZGZFmBDxlcYcK1qqMX_gA62ak3IEakGT_Rrp14-e4d4NrnlVNZsPVUVCLLF924hirlhO5vOXRdVlovZpJSpf9QG5kAEI7ZlxuLFHydODAE9c8XXywUNmJAf8BqMjrSujpjeM6hDpGcuO6rLEBURuYGslfQk_z1A6f94r3gel6LYH1iGS-_GJTyXhD3oVHm-PbGAiwHmBN9_IIQc-IKiDh3-cyrPy0UexXmJI79UHrBjuz2q9kwGDkT2X7zcpPSMEwa2BaAZvwOW_zCz54LRMOS-OXz4UsZXCb_vgZkrp6LQ3_eAHRzHro_eXuTtIQJRxmNRdqLSMICWRQZJFx7fk0eFPu9Zw4APT_HtWrcEioA1l_nEZfveebn6VSVQyb6nIUOJghyWvECK5agwCeHoJ4ma6nYThGDD06qszvkRJkVg1pob_GscwDbE15OhpjeYfP8lGVBIo6MVuqbMZSGZlZ8dbYG29gaxN0NC11MUkpCAwam7a18usjg0lL_sAr0WXo517LovIgzBT3KhqMZxL8RG3UaQP_vwWt4TkBvN7wWuudEd__70rgAk1gEbJ1fTuDsYeUJq93CKoN5Wc4o05jK2LfcBzIaNopxq5je38rWaECCLYHOlPlVy9eA.uVxf9FJ31LUx0p8hAp2wyA',
}
const __dirname = path.resolve()
// const userInfo = os.userInfo()
// const rootPath = `${userInfo.homedir}\\Documents\\WeChat Files\\`

function prepareWxOpenAiParams (room:Room|undefined, topic:string, nickName:string, wxid:string, roomid:string, query: any) {
  const username = room ? `${nickName}|${wxid}/${topic}|${roomid}` : `${nickName}|${wxid}`
  const queryData:QueryData = {
    msg:query,
    username,
  }

  return queryData
}

async function wxai (sysConfig: any, bot: Wechaty, talker: Contact, room: Room | undefined, message: Message) {
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

  if (room && message.type() === types.Message.MiniProgram && !sysConfig.linkWhiteList.includes(talker.id)) {
    const miniProgram = await message.toMiniProgram()
    text = `${miniProgram.title()?.slice(0, 5)}是由群主或管理员所发布的小程序卡片消息吗？`
    answer = await aibot(sysConfig, talker, room, text)
  }

  if (room && message.type() === types.Message.Url && !sysConfig.linkWhiteList.includes(talker.id)) {
    const urllink = await message.toUrlLink()
    text = `${urllink.title().slice(0, 5)}是由群主或管理员所发布的小程序卡片消息吗？`
    answer = await aibot(sysConfig, talker, room, text)
  }

  //   log.info(JSON.stringify(answer))
  console.debug('回复消息：', JSON.stringify(answer))

  if (answer.messageType) {
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

  if (message.type() === types.Message.Attachment) {
    try {
      const file = await message.toFileBox()
      const fileName = file.name
      // text = `${urllink.title().slice(0, 5)}是由群主或管理员所发布的小程序卡片消息吗？`
      // answer = await aibot(talker, room, text)
      if (fileName.split('.')[1] === 'xlsx') {
        // log.info('file=============', file)
        const filePath = __dirname + `\\data\\media\\image\\${new Date().getTime() + fileName}`
        // let filePath = `C:\\Users\\wechaty\\Documents\\WeChat Files\\wxid_0o1t51l3f57221\\FileStorage\\File\\2022-05\\${file.name}`
        await file.toFile(filePath)
        await delay(1000)
        log.info('fileName=====', filePath)

        // await excel2order(filePath, message)
      }
    } catch (err) {
      log.error('转换失败', err)
    }

  }

  // if (message.type() === types.Message.Image) {
  //   await delay(1000)
  //   try {
  //     const file = await message.toFileBox()
  //     log.info('image=====', file)
  //   } catch (err) {
  //     log.error('image=====', err)
  //   }

  // }

};

async function aibot (sysConfig: any, talker: any, room: any, query: any) {
  let answer = {}
  const roomid = room?.id
  const wxid = talker.id
  const nickName = talker.name()
  const topic = await room?.topic()
  // log.info(opt)
  const content = query

  let answerJson
  switch (callBot) {
    case 'WxOpenai':
      // log.info('开始请求微信对话平台...')
      init({
        EncodingAESKey: sysConfig.WXOPENAI_ENCODINGAESKEY,
        TOKEN: sysConfig.WXOPENAI_TOKEN,
      })

      try {
        const queryData = prepareWxOpenAiParams(room, topic, nickName, wxid, roomid, query)
        const resMsg:any = await chat(queryData)

        // console.debug(resMsg)
        log.info('对话返回原始：', resMsg)
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
            default:
              log.info(JSON.stringify({ msg: '没有命中关键字', nickName, query, roomid, topic }))
              break
          }

          if (sysConfig.DIFF_REPLY_ONOFF) {
            if (room && (resMsg.skill_name !== topic && resMsg.skill_name !== '通用问题')) {
              answer = {}
            }
          }
        }
      } catch (err) {
        log.error(JSON.stringify(err))
      }
      break
    case 'ChatGPT':
      try {
        const api = new ChatGPTAPI({ sessionToken: config.ChatGPTSessionToken })
        // ensure the API is properly authenticated (optional)
        await api.ensureAuth()
        const t0 = new Date().getTime()
        console.log('content: ', content)
        // send a message and wait for the response
        const response = await api.sendMessage(content)
        // TODO: format response to compatible with wechat messages
        const t1 = new Date().getTime()
        console.log('response: ', response)
        console.log('耗时: ', (t1 - t0) / 1000, 's')
        // response is a markdown-formatted string
        answer = {
          messageType: types.Message.Text,
          text: response,
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
