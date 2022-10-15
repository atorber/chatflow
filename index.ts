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

// import openai from 'openai-sdk'
// const {
//   init,
//   chat,
//   nlp,
// } = openai

import fs from 'fs'

import {
  init,
  chat,
  chatAibot,
  nlp,
  QueryData,
  genToken,
} from './src/openai/index.js'

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

import excel2order from './src/excel.js'
import { FileBox } from 'file-box'
import path from 'path'

import os from 'os'

import configs from './config.js'
import type { Puppet } from 'wechaty-puppet'

import * as io from 'socket.io-client'

import { VikaBot } from './src/vika.js'

import { JsonRpcError } from 'json-rpc-peer'

const __dirname = path.resolve()
const userInfo = os.userInfo()
const rootPath = `${userInfo.homedir}\\Documents\\WeChat Files\\`

let bot: any
let sysConfig: any

if (process.env['VIKA_SPACENAME']) {
  configs.VIKA_SPACENAME = process.env['VIKA_SPACENAME']
}

if (process.env['VIKA_TOKEN']) {
  configs.VIKA_TOKEN = process.env['VIKA_TOKEN']
}

const vikaConfig = {
  spaceName: configs.VIKA_SPACENAME,
  token: configs.VIKA_TOKEN,
}
console.debug(vikaConfig)

const vika = new VikaBot(vikaConfig)

async function main () {

  void await vika.checkInit()
  // 获取系统配置信息
  sysConfig = await vika.getConfig()
  log.info(sysConfig)

  sysConfig = { ...configs, ...sysConfig }
  log.info(sysConfig)

  init({
    TOKEN: sysConfig.WX_TOKEN,
    EncodingAESKey: sysConfig.EncodingAESKey,
  })

  const wechatyConfig: any = {
    // 网页版微信
    'wechaty-puppet-wechat': {
      name: 'openai-qa-bot',
      puppet: 'wechaty-puppet-wechat',
      puppetOptions: {
        uos: true,
      },
    },
    // Windows桌面版微信
    'wechaty-puppet-xp': {
      name: 'openai-qa-bot',
      puppet: 'wechaty-puppet-xp',
    },
    // pad-local
    'wechaty-puppet-padlocal': {
      name: 'openai-qa-bot',
      puppet: 'wechaty-puppet-padlocal',
      puppetOptions: {
        token: sysConfig.puppetToken,
      },
    },
  }

  bot = WechatyBuilder.build(wechatyConfig[sysConfig.puppetName])

  // IM相关配置
  const configData = {
    socket: '',
    chatInfoEn: {
      chatState: 'agent', // chat状态；robot 机器人、agent 客服
      inputContent: '', // 输入框内容
      msgList: [], // 消息列表
      state: 'on', // 连接状态;on ：在线；off：离线
      lastMsgShowTime: new Date(), // 最后一个消息的显示时间
    }, // 会话信息，包括聊天记录、状态
    clientChatEn: {
      clientChatId: 'ledongmao',
      clientChatName: '客服机器人',
      avatarUrl: 'static/image/im_client_avatar.png',
    }, // 当前账号的信息
    serverChatEn: {
      serverChatId: 'xiaop',
      serverChatName: '小P',
      avatarUrl: 'static/image/im_robot_avatar.png',
    }, // 服务端chat信息
    robotEn: {
      robotName: '小旺',
      avatarUrl: 'static/image/im_robot_avatar.png',
    }, // 机器人信息
    faqList: [
      { title: '今天周几', content: '今天周一' },
      { title: '今天周几', content: '今天周二' },
      { title: '今天周几', content: '今天周三' },
      { title: '今天周几', content: '今天周四' },
      { title: '今天周几', content: '今天周五' },
    ],
    faqSelected: '-1',
    inputContent_setTimeout: null, // 输入文字时在输入结束才修改具体内容
    selectionRange: null, // 输入框选中的区域
    shortcutMsgList: [], // 聊天区域的快捷回复列表
    logoutDialogVisible: false, // 结束会话显示
    transferDialogVisible: false, // 转接人工dialog
    rateDialogVisible: false, // 评价dialog
    leaveDialogVisible: false, // 留言dialog
  }
  let socket: io
  if (sysConfig.imOpen) {
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
        log.info(data)
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
          log.error(JSON.stringify(e))
        }

      })
    })
  } else {
    socket = {}
  }

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

      // log.debug(configData.serverChatEn.serverChatId)
    }
    // 2.添加到消息集合李
    //   addChatMsg(msg)
  }

  async function onScan (qrcode: string, status: ScanStatus) {
    console.debug(qrcode)
    if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
      const qrcodeUrl = encodeURIComponent(qrcode)

      const qrcodeImageUrl = [
        'https://wechaty.js.org/qrcode/',
        qrcodeUrl,
      ].join('')
      log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)

      qrcodeTerminal.generate(qrcode, { small: true })  // show qrcode on console

      let uploadedAttachments = ''
      let file:FileBox
      let filePath = 'qrcode.png'
      try {
        file = FileBox.fromQRCode(qrcode)
        if (file) {
          filePath = './' + file.name
          try {
            const writeStream = fs.createWriteStream(filePath)
            await file.pipe(writeStream)
            await wait(200)
            const readerStream = fs.createReadStream(filePath)
            uploadedAttachments = await vika.upload(readerStream)
            const text = qrcodeImageUrl
            await vika.addScanRecord(uploadedAttachments, text)
            fs.unlink(filePath, (err) => {
              console.debug('上传vika完成删除文件：', filePath, err)
            })
          } catch {
            console.debug('上传失败：', filePath)
            fs.unlink(filePath, (err) => {
              console.debug('上传vika失败删除文件', filePath, err)
            })
          }
        }

      } catch (e) {
        console.log('vika 写入失败：', e)
      }

    } else {
      log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
    }
  }

  function onLogin (user: Contact) {
    log.info('StarterBot', '%s login', user.payload)
    // log.info(JSON.stringify(user.payload))
  }

  function onLogout (user: Contact) {
    log.info('StarterBot', '%s logout', user)
  }

  async function onMessage (message: Message) {

    log.info('onMessage', JSON.stringify(message))

    // nodered启用时执行
    if (sysConfig.noderedOpen) {
      await doLog(message)
    }

    const talker = message.talker()
    const text = message.text()
    const room = message.room()
    const roomId = room?.id
    const topic = await room?.topic()

    try {
      const isSelfMsg = message.self()

      if (room && roomId && !isSelfMsg) {

        if (sysConfig.roomWhiteListOpen) {
          const isInRoomWhiteList = sysConfig.roomWhiteList.includes(roomId)
          if (isInRoomWhiteList) {
            log.info('当前群在白名单内，请求问答...')
            await wxai(room, message)
          } else {
            log.info('当前群不在白名单内，流程结束')
          }
        }

        if (!sysConfig.roomWhiteListOpen) {
          log.info('系统未开启白名单，请求问答...')
          await wxai(room, message)
        }

        // IM服务开启时执行
        if (sysConfig.imOpen && bot.Message.Type.Text === message.type()) {
          configData.clientChatEn.clientChatId = talker.id + ' ' + room.id
          configData.clientChatEn.clientChatName = talker.name() + '@' + topic
          // log.debug(configData)
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
          log.info(JSON.stringify(data))
          sendMsg(data)
        }

      }

      if ((!room || !room.id) && !isSelfMsg) {
        await wxai(undefined, message)
      }

    } catch (e) {
      log.error('发起请求wxai失败', e)
    }

    // if (text == '我要转发') {
    //   await message.say('接收密码')
    // }

    // if (text == '我要接收') {
    //   await message.say('发送密码')
    // }

    // if (text == '发送密码to接收密码') {
    //   await message.say('发送密码')
    // }

  }

  const missingConfiguration = []
  for (const key in configs) {
    if (!configs[key] && !['imOpen', 'noderedOpen', 'DIFF_REPLY_ONOFF'].includes(key)) {
      missingConfiguration.push(key)
    }
  }

  if (missingConfiguration.length === 0) {

    const vikaConfig = { token: configs.VIKA_TOKEN, spaceName: configs.VIKA_SPACENAME }

    bot.use(
      WechatyVikaPlugin(vikaConfig),
    )
    bot.on('scan', onScan)
    bot.on('login', onLogin)
    bot.on('logout', onLogout)
    bot.on('message', onMessage)
    bot.on('room-join', async (room: { topic: () => any; id: any; say: (arg0: string, arg1: any) => any }, inviteeList: any[], inviter: any) => {
      const nameList = inviteeList.map(c => c.name()).join(',')
      log.info(`Room ${await room.topic()} got new member ${nameList}, invited by ${inviter}`)
      if (sysConfig.welcomeList.includes(room.id)) {
        const newer = inviteeList[0]
        if (newer) {
          const newers: [Contact] = [newer]
          await room.say(`欢迎加入${await room.topic()},请阅读群公告~`, ...newers)
        }
      }
    })
    bot.start()
      .then(() => log.info('Starter Bot Started.'))
      .catch((e: any) => log.error(JSON.stringify(e)))
  } else {
    log.error('\n======================================\n\n', `错误提示：\n缺少${missingConfiguration.join()}配置参数,请检查config.js文件\n\n======================================`)
    log.info(configs)
  }
}

function roomlinker (message: { text: () => any }) {
  const text = message.text()
  return ''
}

async function wxai (room: Room | undefined, message: Message) {
  const talker = message.talker()
  //   const roomid = room ? room.id : ''
  let text = message.text()
  let answer: any = {}
  if (message.type() === bot.Message.Type.Text && room) {
    answer = await aibot(talker, room, text)
  }

  if (message.type() === bot.Message.Type.Text && !room) {
    answer = await aibot(talker, undefined, text)
  }

  if (room && message.type() === bot.Message.Type.MiniProgram && !sysConfig.linkWhiteList.includes(talker.id)) {
    const miniProgram = await message.toMiniProgram()
    text = `${miniProgram.title()?.slice(0, 5)}是由群主或管理员所发布的小程序卡片消息吗？`
    answer = await aibot(talker, room, text)
  }

  if (room && message.type() === bot.Message.Type.Url && !sysConfig.linkWhiteList.includes(talker.id)) {
    const urllink = await message.toUrlLink()
    text = `${urllink.title().slice(0, 5)}是由群主或管理员所发布的小程序卡片消息吗？`
    answer = await aibot(talker, room, text)
  }

  log.info(JSON.stringify(answer))

  if (answer.messageType) {
    switch (answer.messageType) {
      case types.Message.Text: {
        log.info(`向 ${talker.name()} 发送消息...`)

        if (room) {
          answer = text.length > 20 ? (answer.text + '\n------------------------------\n' + talker.name() + ':' + text.slice(0, 10) + '...') : (answer.text + '\n------------------------------\n' + talker.name() + ':' + text)
          await room.say(answer, ...[talker])
        } else {
          answer = answer.text
          await message.say(answer)
        }

        break
      }
      case types.Message.Image: {
        const fileBox = FileBox.fromUrl(answer.text.url)

        if (room) {
          await room.say(fileBox)
        } else {
          await message.say(fileBox)
        }

        break
      }
      case types.Message.MiniProgram: {

        const miniProgram = new bot.MiniProgram({
          appid: answer.text.appid,
          title: answer.text.title,
          pagePath: answer.text.pagepath,
          // thumbUrl: answer.text.thumb_url,
          thumbUrl: 'https://openai-75050.gzc.vod.tencent-cloud.com/openaiassets_afffe2516dac42406e06eddc19303a8d.jpg',
          thumbKey: '42f8609e62817ae45cf7d8fefb532e83',
        })

        let sayRes: any
        if (room) {
          sayRes = await room.say(miniProgram)
        } else {
          sayRes = await message.say(miniProgram)
        }

        console.debug(sayRes)

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

  // if (message.type() === bot.Message.Type.Image) {
  //   await wait(1000)
  //   try {
  //     const file = await message.toFileBox()
  //     log.info('image=====', file)
  //   } catch (err) {
  //     log.error('image=====', err)
  //   }

  // }

};

async function aibot (talker: Contact, room: Room | undefined, query: string) {
  // log.info('开始请求微信对话平台...')

  const roomid = room?.id
  const wxid = talker.id
  const nickName = talker.name()
  const topic = await room?.topic()
  // log.info(opt)

  let answer: any = {}
  let answerJson: any

  try {
    const username = room ? (nickName + '/' + topic) : nickName
    const userid = room ? (wxid + '/' + roomid) : wxid
    const signature = genToken({
      username,
      userid,
    })

    let queryData: QueryData
    if (sysConfig.DIFF_REPLY_ONOFF && room) {
      queryData = {
        signature,
        query,
        first_priority_skills: [topic || ''],
        second_priority_skills: ['通用问题'],
      }
    } else {
      queryData = {
        signature,
        query,
        first_priority_skills: ['通用问题'],
      }
    }

    const resMsg = await chatAibot(queryData)
    log.info(JSON.stringify(resMsg))

    if (resMsg.msgtype && resMsg.confidence > 0.8) {
      switch (resMsg.msgtype) {
        case 'text':
          answer = {
            messageType: types.Message.Text,
            text: resMsg.answer,
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
        default:
          log.info(JSON.stringify({ msg: '没有命中关键字', nickName, topic, roomid, query }))
          break
      }

      if (sysConfig.DIFF_REPLY_ONOFF && room && (resMsg.skill_name !== topic && resMsg.skill_name !== '通用问题')) {
        answer = {}
      }
      return answer
    }
    return answer
  } catch (err) {
    log.error(JSON.stringify(err))
    return answer
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

// 定义一个延时方法
const wait = (ms: number | undefined) => new Promise(resolve => setTimeout(resolve, ms))

void main()
