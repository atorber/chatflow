#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import 'dotenv/config.js'

import { Contact, Message, log, Wechaty } from 'wechaty'
import { FileBox } from 'file-box'
import XLSX from 'xlsx'
import { sendMsg } from '../services/configService.js'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

async function sendTextMessage (contact: Contact, text: string): Promise<boolean> {
  try {
    await sendMsg(contact, `${contact.name()}，${text}`)
    return true
  } catch (error) {
    log.error('StarterBot', 'Error sending message: %s', error)
    return false
  }
}

async function sendNotice (bot:Wechaty, message: Message) {
  log.info('发送通知任务:', message.talker().id)
  await delay(3000)
  // 检测群消息
  const file = await message.toFileBox()
  const fileType = file.name.split('.').pop()

  if (fileType === 'xlsx' || fileType === 'xls') {
    const buffer = await file.toBuffer()
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0] || 'null'
    const sheet = workbook.Sheets[sheetName]

    if (sheet !== undefined) {
      const data:any = XLSX.utils.sheet_to_json(sheet, { header: 1 })

      if (data[0].includes('wxid') && data[0].includes('text') && data[0].includes('state')) {
        const wxidIndex = data[0].indexOf('wxid')
        const textIndex = data[0].indexOf('text')
        const stateIndex = data[0].indexOf('state')

        let successCount = 0
        let failureCount = 0
        const failedWxids:string[] = []

        for (let i = 1; i < data.length; i++) {
          const wxid = data[i][wxidIndex]
          const text = data[i][textIndex]
          log.info('通知内容：', wxid, text)

          try {
            const contact:Contact|undefined = await bot.Contact.find({ id: wxid })
            log.info('contact:', JSON.stringify(contact))
            if (contact && contact.friend()) {
              const isSuccess = await sendTextMessage(contact, text)
              await delay(100)
              data[i][stateIndex] = isSuccess ? '成功' : '失败'
              isSuccess ? successCount++ : failureCount++
              if (!isSuccess) {
                failedWxids.push(wxid)
              }
            } else {
              data[i][stateIndex] = '失败'
              failedWxids.push(wxid)
              failureCount++
            }
          } catch (err) {
            log.info('wxid不存在', err)
          }
        }

        const updatedSheet = XLSX.utils.aoa_to_sheet(data)
        workbook.Sheets[sheetName] = updatedSheet
        const updatedBuffer = XLSX.write(workbook, {  bookType: 'xlsx', type: 'buffer' })

        const updatedFile = FileBox.fromBuffer(updatedBuffer, 'res_' + file.name)
        log.info('updatedFile:', updatedFile)
        await sendMsg(message, `通知发送完成，成功${successCount}人，失败${failureCount}人，详情查看excel文件`)
        await sendMsg(message, updatedFile)
      }
    }

  }

}

export { sendNotice }

export default sendNotice
