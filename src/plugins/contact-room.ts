import XLSX from 'xlsx'
import csv from 'fast-csv'
import {
  Contact,
  log,
  Wechaty,
} from 'wechaty'

import { FileBox } from 'file-box'
import { createWriteStream } from 'fs'

// 导出联系人和群列表到csv文件
export async function exportContactsAndRoomsToCSV (bot:Wechaty) {
  // 获取所有联系人和群聊
  const contacts = await bot.Contact.findAll()
  const rooms = await bot.Room.findAll()

  // 准备CSV数据
  const csvData = []
  contacts.forEach((contact: Contact) => {
    if (contact.friend()) {
      csvData.push({ ID: contact.id, Name: Buffer.from(contact.name(), 'utf-8').toString() || '未知', Type: 'Contact' })
    }
  })

  for (const room of rooms) {
    csvData.push({ ID: room.id, Name: Buffer.from(await room.topic(), 'utf-8').toString() || '未知', Type: 'Room' })
  }

  log.info('通讯录原始数据：', csvData)

  const fileName = './db/contacts_and_rooms.csv'
  const writeStream = createWriteStream(fileName)
  const csvStream = csv.format({ headers: true })
  csvStream.pipe(writeStream).on('end', () => {
    log.info('CSV file written successfully')
  })

  csvData.forEach((item) => {
    csvStream.write(item)
  })

  csvStream.end()

  // 返回FileBox对象
  return FileBox.fromFile(fileName)
}

// 导出联系人和群列表到xlsx文件
export async function exportContactsAndRoomsToXLSX (bot:Wechaty) {
  // 获取所有联系人和群聊
  const contacts = await bot.Contact.findAll()
  const rooms = await bot.Room.findAll()

  // 准备联系人和群聊数据
  const contactsData = [ [ 'Name', 'ID' ] ]
  const roomsData = [ [ 'Name', 'ID' ] ]
  contacts.forEach((contact) => {
    if (contact.friend()) {
      contactsData.push([ contact.name(), contact.id ])
    }
  })

  for (const room of rooms) {
    roomsData.push([ await room.topic(), room.id ])
  }

  // 创建一个新的工作簿
  const workbook = XLSX.utils.book_new()

  // 将数据添加到工作簿的不同sheet中
  const contactsSheet = XLSX.utils.aoa_to_sheet(contactsData)
  const roomsSheet = XLSX.utils.aoa_to_sheet(roomsData)
  XLSX.utils.book_append_sheet(workbook, contactsSheet, 'Contacts')
  XLSX.utils.book_append_sheet(workbook, roomsSheet, 'Rooms')

  // 将工作簿写入文件
  const fileName = './db/contacts_and_rooms.xlsx'
  XLSX.writeFile(workbook, fileName)

  // 返回FileBox对象
  return FileBox.fromFile(fileName)
}
