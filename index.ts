#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
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
  Message,
  ScanStatus,
  WechatyBuilder,
  log,
} from 'wechaty'

import {
  OneToManyRoomConnector,
  OneToManyRoomConnectorConfig,
  ManyToOneRoomConnector,
  ManyToOneRoomConnectorConfig,
} from 'wechaty-plugin-contrib'

import qrcodeTerminal from 'qrcode-terminal'
import rp from 'request-promise'

// import WechatyVikaPlugin from 'wechaty-vika-link'
import WechatyVikaPlugin from './src/index.js'

import excel2order from './excel.js'
import { FileBox } from 'file-box'
import path from 'path'

import os from 'os'

import configs from './config.js'
const __dirname = path.resolve()
const userInfo = os.userInfo()
const rootPath = `${userInfo.homedir}\\Documents\\WeChat Files\\`

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
}

function onLogout (user: Contact) {
  log.info('StarterBot', '%s logout', user)
}

async function onMessage (message: Message) {

  try {
    console.table({
      msg: 'onMessage 消息id和类型',
      id: message.id,
      type: bot.Message.Type[message.type()],
    })
    if (message.room() && message.room().id) {
      await wxai(message)
    }
  } catch (e) {
    log.error('发起请求wxai失败', e)
  }
  const text = message.text()
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
  if (!configs[key]) {
    missingConfiguration.push(key)
  }
}

const bot = WechatyBuilder.build({
  name: 'openai-qa-bot',
  puppet: 'wechaty-puppet-xp',
})

if (missingConfiguration.length === 0) {

  const vika_config = { token: configs.VIKA_TOKEN, sheetName: configs.VIKA_DATASHEETNAME, spaceName: configs.VIKA_SPACENAME }
  bot.use(
    WechatyVikaPlugin(vika_config),
  )
  bot.on('scan', onScan)
  bot.on('login', onLogin)
  bot.on('logout', onLogout)
  bot.on('message', onMessage)
  bot.start()
    .then(() => log.info('StarterBot', 'Starter Bot Started.'))
    .catch(e => log.error('StarterBot', e))
} else {
  log.error('\n======================================\n\n', `错误提示：\n缺少${missingConfiguration.join()}配置参数,请检查config.js文件\n\n======================================`)
  console.table(configs)
}

function roomlinker (message: { text: () => any }) {
  const text = message.text()
  return ''
}

async function wxai (message: Message) {
  const room = message.room()
  const talker = message.talker()
  const roomid = room.id
  let text = message.text()
  let answer = ''
  if (message.type() === bot.Message.Type.Text) {
    answer = await aibot(talker, room, text)
  }

  if (message.type() === bot.Message.Type.MiniProgram && configs.linkWhiteList.includes(talker.id)) {
    const MiniProgram = await message.toMiniProgram()
    text = `${MiniProgram.title().slice(0, 5)}是由群主或管理员所发布的小程序卡片消息吗？`
    answer = await aibot(talker, room, text)
  }

  if (message.type() === bot.Message.Type.Url && configs.linkWhiteList.includes(talker.id)) {
    const urllink = await message.toUrlLink()
    text = `${urllink.title().slice(0, 5)}是由群主或管理员所发布的小程序卡片消息吗？`
    answer = await aibot(talker, room, text)
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

  // log.info('answer=====================', answer)
  if (answer) {
    log.info(`向 ${talker.name()} 发送消息...`)
    await room.say(answer, ...[talker])
  }
};

async function aibot (talker: { name: () => any }, room: { id: any; topic: () => any }, query: any) {
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
  let answer = ''
  const log = {}
  try {
    // console.info('请求问答...')
    const resMsg = await rp(opt)
    // log.info(JSON.stringify(resMsg))
    if (resMsg.answer_type == 'text') {
      let msgText = resMsg.answer
      // log.info('msgText==========', msgText)
      try {
        msgText = JSON.parse(msgText)
        // console.table(msgText)

        if (msgText.multimsg && msgText.multimsg.length) {
          const answers = msgText.multimsg
          console.table(answers)
          for (const i in answers) {
            const textArr = answers[i].split(roomid)
            // log.info('textArr===========', textArr)
            if (textArr.length == 2) {
              answer = textArr[1]
            }
          }
          console.table({ answer, nickName, topic, roomid, query })
          return answer
        }
        console.table({ msg: '没有命中关键字', nickName, topic, roomid, query })
        return answer
      } catch (err) {
        // log.error(err)
        const textArr = msgText.split(roomid)
        if (textArr.length == 2) {
          answer = textArr[1]
          return answer
        }
        console.table({ msg: '没有命中关键字', nickName, topic, roomid, query })
        return answer
      }
    }
    return answer
  } catch (err) {
    console.table(err)
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
