/* eslint-disable camelcase */
import { log, Message, types } from 'wechaty'
import { Client } from 'minio'
import { ChatFlowCore } from '../index.js'

function upload (file_payload: { cloudPath?: any; fileContent?: any }) {
  // Instantiate the minio client with the endpoint
  // and access keys as shown below.
  const minioClient = new Client({
    endPoint: ChatFlowCore.configEnv.endpoint,
    // port: 80,
    // useSSL: false,
    accessKey: ChatFlowCore.configEnv.accessKeyId,
    secretKey: ChatFlowCore.configEnv.secretAccessKey,
    region: ChatFlowCore.configEnv.region,
  })
  // Upload a Buffer without content-type (default: 'application/octet-stream')
  minioClient.putObject(ChatFlowCore.configEnv.bucketName, file_payload.cloudPath
    , file_payload.fileContent).catch((err) => {
    log.info('上传文件失败', err)
  })
}

async function uploadMessage (message: Message) {
  // log.info(message)

  try {
    let file_payload = {}
    let msg_type = 'Unknown'
    const msgId = message.id
    switch (message.type()) {
      // 图片消息
      case types.Message.Image:{
        msg_type = 'Image'
        const messageImage = await message.toImage()

        // 原图
        // const artworkImage = await messageImage.artwork()
        // const artworkImageData = await artworkImage.toBuffer()

        // 缩略图
        // const thumbImage = await messageImage.thumbnail()
        // const thumbImageData = await thumbImage.toBuffer()

        // log.info(thumbImageData)

        // 大图
        const hdImage = await messageImage.hd()
        const hdImageData = await hdImage.toBuffer()
        // 大图图片二进制数据
        file_payload = {
          cloudPath: msg_type + '/' + msgId + '.' + hdImage.name.split('.').pop(),
          fileContent: hdImageData,
        }

        upload(file_payload)

        break
      }

      // 链接卡片消息
      case types.Message.Url:{
        msg_type = 'Url'
        // const urlLink = await message.toUrlLink()
        // urlLink: 链接主要数据：包括 title，URL，description

        const urlThumbImage = await message.toFileBox()
        const urlThumbImageData = await urlThumbImage.toBuffer()
        // urlThumbImageData: 链接的缩略图二进制数据
        file_payload = {
          cloudPath: msg_type + '/' + msgId + '.' + urlThumbImage.name.split('.').pop(),
          fileContent: urlThumbImageData,
        }
        upload(file_payload)

        break
      }

      // 语音消息
      case types.Message.Audio:{
        msg_type = 'Audio'

        const audioFileBox = await message.toFileBox()
        const audioData = await audioFileBox.toBuffer()
        // audioData: silk 格式的语音文件二进制数据
        file_payload = {
          cloudPath: msg_type + '/' + msgId + '.' + audioFileBox.name.split('.').pop(),
          fileContent: audioData,
        }
        upload(file_payload)
        break
      }

      // 视频消息
      case types.Message.Video:{
        msg_type = 'Video'

        const videoFileBox = await message.toFileBox()
        const videoData = await videoFileBox.toBuffer()
        // videoData: 视频文件二进制数
        file_payload = {
          cloudPath: msg_type + '/' + msgId + '.' + videoFileBox.name.split('.').pop(),
          fileContent: videoData,
        }
        // uploaded_attachments = await vika.upload(file_payload, vikaConfig.sysTables.ChatRecord)
        upload(file_payload)

        break
      }

      // 动图表情消息
      case types.Message.Emoticon:{
        msg_type = 'Emoticon'

        const emotionFile = await message.toFileBox()

        const emotionData = await emotionFile.toBuffer()
        // emotionData: 动图 Gif文件 二进制数据
        file_payload = {
          cloudPath: msg_type + '/' + msgId + '.' + emotionFile.name.split('.').pop(),
          fileContent: emotionData,
        }
        upload(file_payload)
        break
      }

      // 文件消息
      case types.Message.Attachment:{
        msg_type = 'Attachment'

        const attachFileBox = await message.toFileBox()
        const attachData = await attachFileBox.toBuffer()
        // attachData: 文件二进制数据
        file_payload = {
          cloudPath: msg_type + '/' + msgId + '.' + attachFileBox.name.split('.').pop(),
          fileContent: attachData,
        }
        upload(file_payload)
        break
      }

      // 其他消息
      default:
        break
    }
  } catch (e) {
    log.info('上传文件消息失败', e)
  }
}

export { uploadMessage }

export default uploadMessage
