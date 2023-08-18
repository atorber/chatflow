#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import 'dotenv/config.js'
import {
  WechatyBuilder,
  // types,
} from 'wechaty'
import * as PUPPET from 'wechaty-puppet'

// 导入wechaty-puppet-wechat模块，用于连接网页版微信
// 导入qrcode-terminal模块，用于在终端显示二维码
import qrcodeTerminal from 'qrcode-terminal'
// 引入fs模块，用于文件操作
import fs from 'fs'
// 定义一个csv文件路径，用于存储消息
const csvFile = './messages.csv'
// 定义一个文件夹路径，用于存储图片、视频、文件、语音消息
const mediaFolder = './media'
// 定义一个数组，用于缓存消息
let messages: string[] = []
// 定义一个定时器，用于每10秒批量写入消息到csv文件
let timer:any

const wait = (ms: number | undefined) => new Promise(resolve => setTimeout(resolve, ms))

// 使用WechatyBuilder构建一个Wechaty实例，并指定使用wechaty-puppet-wechat作为puppet
// const bot = WechatyBuilder.build({
//   name: 'ding-dong-bot',
//   puppet: 'wechaty-puppet-wechat',
//   puppetOptions: {
//     uos: true
//   }
// })

const bot = WechatyBuilder.build({
  name: 'ding-dong-bot',
  puppet: 'wechaty-puppet-xp',
})

// 监听扫码事件
bot.on('scan', (qrcode: string, status: number) => {
  // 在终端显示二维码，并提示用户扫码登录
  qrcodeTerminal.generate(qrcode, { small: true })
  // eslint-disable-next-line no-console
  console.log(`Scan QR Code to login: ${status}`)
})

// 监听登录事件
bot.on('login', user => {
  // eslint-disable-next-line no-console
  console.log(`User ${user} logged in`)
})

// 监听消息事件
bot.on('message', async message => {
  // 获取消息的发送者、接收者、内容、类型和时间戳
  const from = message.talker()
  const to = message.listener()
  const content = message.text()
  const type = message.type()
  const timestamp = message.date().getTime()

  // 如果消息类型是图片、视频、文件或语音，将其保存到本地文件夹，并获取其存储路径
  let path = ''
  if (type === PUPPET.types.Message.Image || type === PUPPET.types.Message.Video || type === PUPPET.types.Message.Attachment || type === PUPPET.types.Message.Audio) {
    await wait(3000)
    try {
    // 创建文件夹，如果已存在则忽略错误
      fs.mkdirSync(mediaFolder, { recursive: true })
      // 获取文件名，格式为：类型_发送者_时间戳.后缀
      const filename = `${type}_${from.name}_${timestamp}.${(await message.toFileBox()).mediaType}`
      // 获取文件路径，格式为：文件夹/文件名
      path = `${mediaFolder}/${filename}`
      // 将消息保存到本地文件夹
      await (await message.toFileBox()).toFile(path)
    } catch (err) {
      console.error(err)
    }
  }

  // 将消息的相关信息添加到缓存数组中，格式为：发送者,接收者,内容,类型,时间戳,路径\n
  messages.push(`${from},${to},${content},${type},${timestamp},${path}\n`)

  // 如果定时器不存在，创建一个定时器，每10秒执行一次写入操作
  if (!timer) {
    timer = setInterval(() => {
      // 如果缓存数组不为空，将其内容写入到csv文件中，并清空缓存数组
      if (messages.length > 0) {
        // 创建csv文件，如果已存在则忽略错误
        fs.openSync(csvFile, 'a')
        // 将缓存数组的内容写入到csv文件中，并处理错误
        fs.appendFile(csvFile, messages.join(''), err => {
          if (err) {
            // eslint-disable-next-line no-console
            console.error(err)
          } else {
            // eslint-disable-next-line no-console
            console.log('Messages written to csv file')
          }
        })
        // 清空缓存数组
        messages = []
      }
    }, 10000)
  }
})

// 启动Wechaty实例
void bot.start()
