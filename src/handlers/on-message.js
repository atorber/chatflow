import fs from 'fs'
import console from 'console'

import * as PUPPET from 'wechaty-puppet'
import { log } from 'wechaty-puppet'

const msgList = []

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

async function onMessage (message, vika) {
  // console.debug(message)
  try {

    let uploaded_attachments = ''
    const msg_type = PUPPET.types.Message[message.type()]
    let file = ''
    let filePath = ''
    let text = ''

    switch (message.type()) {
      // 文本消息
      case PUPPET.types.Message.Text:
        text = message.text()
        break

        // 图片消息

      case PUPPET.types.Message.Image:

        try {
          const img = await message.toImage()
          file = await img.thumbnail()
          await wait(1000)
          // console.debug('file=======================',file)
        } catch (e) {
          console.error('Image解析失败：', e)
        }

        break

      // 链接卡片消息
      case PUPPET.types.Message.Url:

        const urlLink = await message.toUrlLink()
        text = JSON.stringify(JSON.parse(JSON.stringify(urlLink)).payload)
        // file = await message.toFileBox();
        break

      // 小程序卡片消息
      case PUPPET.types.Message.MiniProgram:

        const miniProgram = await message.toMiniProgram()
        text = JSON.stringify(JSON.parse(JSON.stringify(miniProgram)).payload)

        // console.debug(miniProgram)
        /*
        miniProgram: 小程序卡片数据
        {
          appid: "wx363a...",
          description: "贝壳找房 - 真房源",
          title: "美国白宫，10室8厅9卫，99999刀/月",
          iconUrl: "http://mmbiz.qpic.cn/mmbiz_png/.../640?wx_fmt=png&wxfrom=200",
          pagePath: "pages/home/home.html...",
          shareId: "0_wx363afd5a1384b770_..._1615104758_0",
          thumbKey: "84db921169862291...",
          thumbUrl: "3051020100044a304802010002046296f57502033d14...",
          username: "gh_8a51...@app"
        }
       */
        break

      // 语音消息
      case PUPPET.types.Message.Audio:

        try {
          file = await message.toFileBox()

        } catch (e) {
          console.error('Audio解析失败：', e)
        }

        break

      // 视频消息
      case PUPPET.types.Message.Video:

        try {
          file = await message.toFileBox()

        } catch (e) {
          console.error('Video解析失败：', e)
        }
        break

      // 动图表情消息
      case PUPPET.types.Message.Emoticon:

        try {
          file = await message.toFileBox()

        } catch (e) {
          console.error('Emoticon解析失败：', e)
        }

        break

      // 文件消息
      case PUPPET.types.Message.Attachment:

        try {
          file = await message.toFileBox()

        } catch (e) {
          console.error('Attachment解析失败：', e)
        }

        break
      // 文件消息
      case PUPPET.types.Message.Location:

        // const location = await message.toLocation()
        // text = JSON.stringify(JSON.parse(JSON.stringify(location)).payload)
        break
      // 其他消息
      default:
        break
    }

    if (file) {
      filePath = './' + file.name
      try {
        const writeStream = fs.createWriteStream(filePath)
        await file.pipe(writeStream)
        await wait(200)
        const readerStream = fs.createReadStream(filePath)
        uploaded_attachments = await vika.upload(readerStream)
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

    // console.debug(message)
    vika.addChatRecord(message, uploaded_attachments, msg_type, text)

  } catch (e) {
    console.log('vika 写入失败：', e)
  }
}

export { onMessage }

export default onMessage
