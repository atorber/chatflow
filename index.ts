#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable no-console */
/* eslint-disable eqeqeq */
/* eslint-disable camelcase */
/* eslint-disable sort-keys */
/**
 * Wechaty - Conversational RPA SDK for Chatbot Makers.
 *  - https://github.com/wechaty/wechaty
 */
// https://stackoverflow.com/a/42817956/1123955
// https://github.com/motdotla/dotenv/issues/89#issuecomment-587753552
import 'dotenv/config.js'

import {
  Contact,
  Room,
  Message,
  ScanStatus,
  WechatyBuilder,
  log,
  types,
} from 'wechaty'
import * as PUPPET from 'wechaty-puppet'
// import {
//   OneToManyRoomConnector,
//   OneToManyRoomConnectorConfig,
//   ManyToOneRoomConnector,
//   ManyToOneRoomConnectorConfig,
// } from 'wechaty-plugin-contrib'

import qrcodeTerminal from 'qrcode-terminal'
import rp from 'request-promise'

// import WechatyVikaPlugin from 'wechaty-vika-link'
import WechatyVikaPlugin from './src/index.js'

import excel2order from './excel.js'
import { FileBox } from 'file-box'
import path from 'path'

import os from 'os'

import configs from './config.js'
import type { Puppet } from 'wechaty-puppet'

import * as io from 'socket.io-client'

const configData = configs.imConfigData
let socket: io
if (configs.imOpen) {
  socket = io.connect('http://localhost:3001')
  configData.socket = socket
  socket.on('connect', () => {
    // 客户端上线
    socket.emit('CLIENT_ON', {
      clientChatEn: configData.clientChatEn,
      serverChatId: configData.serverChatEn.serverChatId,
    })

    // 服务端链接
    socket.on('SERVER_CONNECTED', (data: { serverChatEn: { serverChatId: string; serverChatName: string; avatarUrl: string } }) => {
      // 1)获取客服消息
      configData.serverChatEn = data.serverChatEn

      // 2)添加消息
      addChatMsg({
        role: 'sys',
        contentType: 'text',
        content: '客服 ' + configData.serverChatEn.serverChatName + ' 为你服务',
      }, () => { })
    })

    // 接受服务端信息
    socket.on('SERVER_SEND_MSG', async (data: any) => {
      console.debug(data)
      // if (data.msg && data.msg.role == 'server') {
      //   data.msg.role = 'client'
      //   sendMsg(data)
      // }
      try {
        const roomId = data.msg.clientChatId.split(' ')[1]
        const contactId = data.msg.clientChatId.split(' ')[0]
        const room = await bot.Room.find({ id: roomId })
        const contact = await bot.Contact.find({ id: contactId })
        if (room) {
          await room.say(data.msg.content, ...[contact])
        }

        // configData.msg.avatarUrl = data.serverChatEn.avatarUrl;
      } catch (e) {
        console.error(e)
      }

    })
  })
} else {
  socket = {}
}

const __dirname = path.resolve()
const userInfo = os.userInfo()
const rootPath = `${userInfo.homedir}\\Documents\\WeChat Files\\`

// Windows桌面版微信
const bot = WechatyBuilder.build({
  name: 'openai-qa-bot',
  puppet: 'wechaty-puppet-xp',
})

// 网页版微信
// const bot = WechatyBuilder.build({
//   name: 'openai-qa-bot',
//   puppet: 'wechaty-puppet-wechat',
//   puppetOptions: {
//     uos: true
//   }
// })

/**
 * 添加chat对象的msg
 * @param {Object} msg 消息对象；eg：{role:'sys',content:'含有新的消息'}
 * @param {String} msg.role 消息所有者身份；eg：'sys'系统消息；
 * @param {String} msg.contentType 消息类型；text:文本(默认)；image:图片
 * @param {String} msg.content 消息内容
 * @param {Function} successCallback 添加消息后的回调
 */
function addChatMsg (msg: { role: any; contentType: any; content?: string; createTime?: any }, successCallback: { (): void; (): any }) {
  // 1.设定默认值
  msg.role = msg.role == undefined ? 'sys' : msg.role
  msg.contentType = msg.contentType == undefined ? 'text' : msg.contentType
  msg.createTime = msg.createTime == undefined ? new Date() : msg.createTime

  // 2.插入消息
  // 1)插入日期
  // 实际场景中，在消息上方是否显示时间是由后台传递给前台的消息中附加上的，可参考 微信Web版
  // 此处进行手动设置，5分钟之内的消息，只显示一次消息
  msg.createTime = new Date(msg.createTime)
  // if (configData.chatInfoEn.lastMsgShowTime === null || msg.createTime.getTime() - configData.chatInfoEn.lastMsgShowTime.getTime() > 1000 * 60 * 5) {
  //   msgList.push({
  //     role: 'sys',
  //     contentType: 'text',
  //     content: '2022-5-30 20:00:00',
  //   })
  //   configData.chatInfoEn.lastMsgShowTime = msg.createTime
  // }

  // 2)插入消息
  // msgList.push(msg)

  // 3.设置chat对象相关属性
  // configData.chatInfoEn.msgList = msgList

  // 4.回调
  successCallback && successCallback()
}

/**
 * 发送消息
 * @param {Object} rs 回调对象
 */
function sendMsg (rs: any) {
  const msg = rs.msg
  msg.role = 'client'
  msg.avatarUrl = configData.clientChatEn.avatarUrl
  if (configData.chatInfoEn.chatState == 'robot') {
    // 机器人发送接口
  } else if (configData.chatInfoEn.chatState == 'agent') {
    // 客服接口
    configData.socket.emit('CLIENT_SEND_MSG', {
      serverChatId: configData.serverChatEn.serverChatId,
      clientChatEn: configData.clientChatEn,
      msg: msg,
    })

    // console.debug(configData.serverChatEn.serverChatId)
  }
  // 2.添加到消息集合李
  //   addChatMsg(msg)
}

// 定义一个延时方法
const wait = (ms: number | undefined) => new Promise(resolve => setTimeout(resolve, ms))

const TOKEN = configs.WX_TOKEN
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
  console.info(user)
}

function onLogout (user: Contact) {
  log.info('StarterBot', '%s logout', user)
}

async function onMessage (message: Message) {

  // nodered启用时执行
  if (configs.noderedOpen) {
    await doLog(message)
  }
  const talker = message.talker()
  const text = message.text()
  const room = message.room()
  try {
    const msgInfo = {
      msg: 'onMessage 消息id和类型',
      id: message.id,
      type: bot.Message.Type[message.type()],
    }
    console.info(msgInfo)
    if (room && room.id) {
      await wxai(room, message)
      const topic = await room.topic()

      // IM服务开启时执行
      if (configs.imOpen && bot.Message.Type.Text === message.type()) {
        configData.clientChatEn.clientChatId = talker.id + ' ' + room.id
        configData.clientChatEn.clientChatName = talker.name() + '@' + topic
        // console.debug(configData)
        socket.emit('CLIENT_ON', {
          clientChatEn: configData.clientChatEn,
          serverChatId: configData.serverChatEn.serverChatId,
        })
        const data = {
          msg: {
            contentType: 'text',
            content: text,
            role: 'client',
            avatarUrl: '/static/image/im_server_avatar.png',
          },
        }
        console.debug(data)
        sendMsg(data)
      }
    }
  } catch (e) {
    log.error('发起请求wxai失败', e)
  }

  if (text == '我要转发') {
    // 生产转发密码
    await message.say('接收密码')
  }

  if (text == '我要接收') {
    // 生成接收密码
    await message.say('发送密码')
  }

  if (text == '发送密码to接收密码') {
    // 建立转发关系
    await message.say('发送密码')
  }

}

const missingConfiguration = []
for (const key in configs) {
  if (!configs[key] && !['imOpen', 'noderedOpen', 'DIFF_REPLY_ONOFF'].includes(key)) {
    missingConfiguration.push(key)
  }
}

if (missingConfiguration.length === 0) {

  const vikaConfig = { token: configs.VIKA_TOKEN, sheetName: configs.VIKA_DATASHEETNAME, spaceName: configs.VIKA_SPACENAME }

  bot.use(
    WechatyVikaPlugin(vikaConfig),
  )
  bot.on('scan', onScan)
  bot.on('login', onLogin)
  bot.on('logout', onLogout)
  bot.on('message', onMessage)
  bot.on('room-join', async (room, inviteeList, inviter) => {
    const nameList = inviteeList.map(c => c.name()).join(',')
    console.log(`Room ${await room.topic()} got new member ${nameList}, invited by ${inviter}`)
    if (configs.welcomeList.includes(room.id)) {
      const newer = inviteeList[0]
      if (newer) {
        await room.say(`欢迎加入${await room.topic()},请阅读群公告~`, ...[newer])
      }
    }
  })
  bot.start()
    .then(() => log.info('StarterBot', 'Starter Bot Started.'))
    .catch(e => log.error('StarterBot', e))
} else {
  log.error('\n======================================\n\n', `错误提示：\n缺少${missingConfiguration.join()}配置参数,请检查config.js文件\n\n======================================`)
  console.info(configs)
}

function roomlinker (message: { text: () => any }) {
  const text = message.text()
  return ''
}

async function wxai (room: Room, message: Message) {
  const talker = message.talker()
  //   const roomid = room ? room.id : ''
  let text = message.text()
  let answer: any = {}
  if (message.type() === bot.Message.Type.Text) {
    answer = await aibot(talker, room, text)
  }

  if (message.type() === bot.Message.Type.MiniProgram && !configs.linkWhiteList.includes(talker.id)) {
    const miniProgram = await message.toMiniProgram()
    text = `${miniProgram.title()?.slice(0, 5)}是由群主或管理员所发布的小程序卡片消息吗？`
    answer = await aibot(talker, room, text)
  }

  if (message.type() === bot.Message.Type.Url && !configs.linkWhiteList.includes(talker.id)) {
    const urllink = await message.toUrlLink()
    text = `${urllink.title().slice(0, 5)}是由群主或管理员所发布的小程序卡片消息吗？`
    answer = await aibot(talker, room, text)
  }

  log.info('answer=====================', JSON.stringify(answer))
  if (answer.messageType) {
    switch (answer.messageType) {
      case types.Message.Text: {
        log.info(`向 ${talker.name()} 发送消息...`)
        answer = text.length > 20 ? (answer.text + '\n------------------------------\n' + talker.name() + ':' + text.slice(0, 10) + '...') : (answer.text + '\n------------------------------\n' + talker.name() + ':' + text)
        await room.say(answer, ...[talker])
        break
      }
      case types.Message.Image: {
        const fileBox = FileBox.fromUrl(answer.text)
        await room.say(fileBox)
        break
      }
      case types.Message.MiniProgram: {
        const miniProgram = new bot.MiniProgram({
          appid: answer.text.appid,
          title: answer.text.title,
          pagePath: answer.text.pagepath,
          thumbUrl: answer.text.thumb_url,
          thumbKey: '42f8609e62817ae45cf7d8fefb532e83',
        })

        await room.say(miniProgram)
        break
      }
      default: {
        break
      }

    }

  }

  if (message.type() === bot.Message.Type.Attachment) {
    try {
      const file = await message.toFileBox()
      const fileName = file.name
      // text = `${urllink.title().slice(0, 5)}是由群主或管理员所发布的小程序卡片消息吗？`
      // answer = await aibot(talker, room, text)
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

  if (message.type() === bot.Message.Type.Image) {
    await wait(1000)
    try {
      const file = await message.toFileBox()
      log.info('image=====', file)
    } catch (err) {
      log.error('image=====', err)
    }

  }

};

async function aibot (talker:Contact, room:Room, query: string) {
  // console.info('开始请求微信对话平台...')
  const signature = await getSignature(room)
  const method = 'POST'
  const uri = `https://openai.weixin.qq.com/openapi/aibot/${TOKEN}`
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
  let answer: any = {}
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

          if (!configs.DIFF_REPLY_ONOFF) {
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
      } catch (err: any) {
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

async function getSignature (room: { topic: () => any; id: any }) {
  const query = {}
  const method = 'POST'
  const uri = `https://openai.weixin.qq.com/openapi/sign/${TOKEN}`
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

async function doLog (params: any) {
  const uri = 'http://127.0.0.1:1880/log'
  const method = 'POST'
  const opt = {
    method,
    uri,
    qs: {},
    body: params,
    headers: {},
    json: true,
  }
  try {
    const res = await rp(opt)
    log.info('发送日志成功：', res)
  } catch (err) {
    log.error('发送日志失败：', err)
  }
}
