/* eslint-disable no-console */
/* eslint-disable sort-keys */
import { Vika } from '@vikadata/vika'
import moment from 'moment'
import { v4 } from 'uuid'
import rp from 'request-promise'

import {
  log,
  types,
} from 'wechaty'

import excel2order from './excel.js'

// 定义一个延时方法
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class WxOpenAi {

  constructor (bot, sysConfig) {
    this.sysConfig = sysConfig
    this.bot = bot
  }

  async roomlinker (message) {
    const text = message.text()
    return ''
  }

  async wxai (room, message) {
    const talker = message.talker()
    //   const roomid = room ? room.id : ''
    let text = message.text()
    let answer = {}
    if (message.type() === this.bot.Message.Type.Text && room) {
      answer = await this.aibot(talker, room, text)
    }

    if (room && message.type() === this.bot.Message.Type.MiniProgram && !this.sysConfig.linkWhiteList.includes(talker.id)) {
      const miniProgram = await message.toMiniProgram()
      text = `${miniProgram.title()?.slice(0, 5)}是由群主或管理员所发布的小程序卡片消息吗？`
      answer = await this.aibot(talker, room, text)
    }

    if (room && message.type() === this.bot.Message.Type.Url && !this.sysConfig.linkWhiteList.includes(talker.id)) {
      const urllink = await message.toUrlLink()
      text = `${urllink.title().slice(0, 5)}是由群主或管理员所发布的小程序卡片消息吗？`
      answer = await this.aibot(talker, room, text)
    }

    log.info('answer=====================', JSON.stringify(answer))
    if (answer.messageType) {
      switch (answer.messageType) {
        case types.Message.Text: {
          log.info(`向 ${talker.name()} 发送消息...`)
          answer = text.length > 20 ? (answer.text + '\n------------------------------\n' + talker.name() + ':' + text.slice(0, 10) + '...') : (answer.text + '\n------------------------------\n' + talker.name() + ':' + text)

          if (room) {
            await room.say(answer, ...[talker])
          } else {
            await message.say(answer)
          }

          break
        }
        case types.Message.Image: {
          const fileBox = FileBox.fromUrl(answer.text)

          if (room) {
            await room.say(fileBox)
          } else {
            await message.say(fileBox)
          }

          break
        }
        case types.Message.MiniProgram: {
          const miniProgram = new this.bot.MiniProgram({
            appid: answer.text.appid,
            title: answer.text.title,
            pagePath: answer.text.pagepath,
            thumbUrl: answer.text.thumb_url,
            thumbKey: '42f8609e62817ae45cf7d8fefb532e83',
          })

          if (room) {
            await room.say(miniProgram)
          } else {
            await message.say(miniProgram)
          }

          break
        }
        default: {
          break
        }

      }

    }

    if (message.type() === this.bot.Message.Type.Attachment) {
      try {
        const file = await message.toFileBox()
        const fileName = file.name
        // text = `${urllink.title().slice(0, 5)}是由群主或管理员所发布的小程序卡片消息吗？`
        // answer = await this.aibot(talker, room, text)
        if (fileName.split('.')[1] === 'xlsx') {
          // log.info('file=============', file)
          const filePath = __dirname + `\\cache\\${new Date().getTime() + fileName}`
          // let filePath = `C:\\Users\\wechaty\\Documents\\WeChat Files\\wxid_0o1t51l3f57221\\FileStorage\\File\\2022-05\\${file.name}`
          await file.toFile(filePath)
          await wait(1000)
          log.info('fileName=====', filePath)

          await excel2order(filePath, message)
        }
      } catch (err) {
        log.error('转换失败', err)
      }

    }

    if (message.type() === this.bot.Message.Type.Image) {
      await wait(1000)
      try {
        const file = await message.toFileBox()
        log.info('image=====', file)
      } catch (err) {
        log.error('image=====', err)
      }

    }

  };

  async aibot (talker, room, query) {
    // console.info('开始请求微信对话平台...')
    const signature = await this.getSignature(room)
    const method = 'POST'
    const uri = `https://openai.weixin.qq.com/openapi/aibot/${this.sysConfig.WX_TOKEN}`
    const headers = {}
    const body = {
      signature,
      query,
    }

    const opt = {
      method,
      uri,
      qs: {},
      body,
      headers,
      json: true,
    }
    // log.info(opt)
    const roomid = room.id
    const nickName = talker.name()
    const topic = await room.topic()
    let answer = {}
    try {
      // console.info('请求问答...')
      const resMsg = await rp(opt)
      log.info(JSON.stringify(resMsg))
      if (resMsg.answer_type == 'text') {
        let msgText = resMsg.answer
        // log.info('msgText==========', msgText)
        try {
          msgText = JSON.parse(msgText)
          // console.info(msgText)

          if (msgText.multimsg && msgText.multimsg.length) {
            const answers = msgText.multimsg
            console.info(answers)

            if (!this.sysConfig.DIFF_REPLY_ONOFF) {
              answer = {
                messageType: types.Message.Text,
                text: answers[0],
              }

            } else {
              for (const i in answers) {
                const textArr = answers[i].split(roomid)
                // log.info('textArr===========', textArr)
                if (textArr.length == 2) {
                  answer = {
                    messageType: types.Message.Text,
                    text: textArr[1],
                  }
                  break
                } else {
                  try {
                    answer = JSON.parse(answers[i])
                    if (answer.miniprogrampage) {
                      answer = {
                        messageType: types.Message.MiniProgram,
                        text: answer.miniprogrampage,
                      }
                      // break
                    }
                    if (answer.image) {
                      answer = {
                        messageType: types.Message.Image,
                        text: answer.image.url,
                      }
                      break
                    }
                  } catch (e) {
                    console.error(e)
                  }
                }

              }
            }

            console.info({ answer, nickName, topic, roomid, query })
            return answer
          }
          console.info({ msg: '没有命中关键字', nickName, topic, roomid, query })
          return answer
        } catch (err) {
          log.error(err)
          const textArr = msgText.split(roomid)
          if (textArr.length == 2) {
            answer = {
              messageType: types.Message.Text,
              text: textArr[1],
            }
            return answer
          }
          console.info({ msg: '没有命中关键字', nickName, topic, roomid, query })
          return answer
        }
      }
      return answer
    } catch (err) {
      console.info(err)
      return answer
    }
  }

  async getSignature (room) {
    const query = {}
    const method = 'POST'
    const uri = `https://openai.weixin.qq.com/openapi/sign/${this.sysConfig.WX_TOKEN}`
    const headers = {}
    const topic = await room.topic()
    const body = {
      username: topic,
      avatar: '',
      userid: room.id,
    }

    const opt = {
      method,
      uri,
      qs: query,
      body,
      headers,
      json: true,
    }
    // log.info(opt)

    try {
      const res = await rp(opt)
      // log.info(res)
      const signature = res.signature
      return signature
    } catch (err) {
      log.error('请求微信对话平台获取签名失败：', err)
      return err
    }
  }

  getCurTime () {
    // timestamp是整数，否则要parseInt转换
    const timestamp = new Date().getTime()
    const timezone = 0 // 目标时区时间，东八区
    const offset_GMT = new Date().getTimezoneOffset() // 本地时间和格林威治的时间差，单位为分钟
    const time = timestamp + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000
    return time
  }

}

export { WxOpenAi }

export default WxOpenAi
