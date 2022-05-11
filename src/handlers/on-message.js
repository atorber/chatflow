import { VikaBot } from '../vika.js'
import fs from 'fs'
import console from 'console'

import * as PUPPET from 'wechaty-puppet'
import { log } from 'wechaty-puppet'

let msgList = []

let wait = ms => new Promise(resolve => setTimeout(resolve, ms));
let vika = new VikaBot()

async function onMessage(message) {
  // console.debug(message)
  try {

    let file_payload = {}
    let uploaded_attachments = ''
    let msg_type = 'Unknown'
    let msgId = message.id
    let file = ''
    let fileDate = ''
    let filePath = ''
    let text = ''
    switch (message.type()) {
      // 文本消息
      case PUPPET.types.Message.Text:
        msg_type = 'Text'
        text = message.text();
        break;

      // 图片消息

      case PUPPET.types.Message.Image:
        msg_type = 'Image'
        file = await message.toImage().artwork()
        await wait(1000)
        // console.debug('file=======================',file)
        break;

      // 链接卡片消息
      case PUPPET.types.Message.Url:
        msg_type = 'Url'
        const urlLink = await message.toUrlLink();
        text = JSON.stringify(JSON.parse(JSON.stringify(urlLink)).payload)

        // urlLink: 链接主要数据：包括 title，URL，description

        file = await message.toFileBox();
        break;

      // 小程序卡片消息
      case PUPPET.types.Message.MiniProgram:
        msg_type = 'MiniProgram'

        const miniProgram = await message.toMiniProgram();
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
        break;

      // 语音消息
      case PUPPET.types.Message.Audio:
        msg_type = 'Audio'
        file = await message.toFileBox();

        break;

      // 视频消息
      case PUPPET.types.Message.Video:
        msg_type = 'Video'

        file = await message.toFileBox();
        break;

      // 动图表情消息
      case PUPPET.types.Message.Emoticon:
        msg_type = 'Emoticon'
        file = await message.toFileBox();

        break;

      // 文件消息
      case PUPPET.types.Message.Attachment:
        msg_type = 'Attachment'
        file = await message.toFileBox();

        break;

      // 其他消息
      default:
        break;
    }

    if (file) {
      filePath = './' + file.name
      try {
        const writeStream = fs.createWriteStream(filePath)
        await file.pipe(writeStream)
        await wait(200)
        let readerStream = fs.createReadStream(filePath);
        uploaded_attachments = await vika.upload(readerStream)
        fs.unlink(filePath, (err) => {
          console.debug(filePath, '已删除')
        })
      } catch {
        console.debug('上传失败：', filePath)
      }

    }

    // console.debug(message)
    vika.addChatRecord(message, uploaded_attachments, msg_type, text)

  } catch (e) {
    console.log('监听消息失败', e)
  }
}

export { onMessage }

export default onMessage
