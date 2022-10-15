import fs from 'fs'
import console from 'console'

import * as PUPPET from 'wechaty-puppet'
import { log } from 'wechaty-puppet'
import { FileBox } from 'file-box'
// import {
//   Contact,
//   Room,
//   Message,
//   ScanStatus,
//   WechatyBuilder,
//   types,
// } from 'wechaty'

const msgList = []

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

async function onScan (qrcode, status, vika) {
  console.debug(qrcode, status)

  if (status === PUPPET.ScanStatus.Waiting || status === PUPPET.ScanStatus.Timeout) {
    const qrcodeImageUrl = [
      'https://wechaty.js.org/qrcode/',
      encodeURIComponent(qrcode),
    ].join('')
    log.info('qrcodeImageUrl: %s', qrcodeImageUrl)

    try {
      let uploadedAttachments = ''
      let file = ''
      let filePath = ''
      const text = qrcodeImageUrl

      try {
        file = FileBox.fromUrl(
          qrcodeImageUrl,
          'logo.jpg',
        )
        file.toFile('/tmp/file-box-logo.jpg')

        // await wait(1000)
        // console.debug('file=======================',file)
      } catch (e) {
        console.error('Image解析失败：', e)
      }

      if (file) {
        filePath = './' + file.name
        try {
          const writeStream = fs.createWriteStream(filePath)
          await file.pipe(writeStream)
          await wait(200)
          const readerStream = fs.createReadStream(filePath)
          uploadedAttachments = await vika.upload(readerStream)
          vika.addScanRecord(uploadedAttachments, text)
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

  }
}

export { onScan }

export default onScan
