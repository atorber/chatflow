import nedb from '../db/nedb.js'
import path from 'path'
import os from 'os'
const baseDir = path.join(
  os.homedir(),
  path.sep,
  '.wechaty',
  'wechaty-panel-cache',
  path.sep,
)
const dbpath = baseDir + 'room.db'
const rdb:any = nedb(dbpath)

/**
 * 记录群聊天记录 记录格式
 * { roomName: '群名', roomId: '', content: '内容', contact: '用户名', wxid: '', time: '时间' }
 * @param info
 * @returns {Promise<unknown>}
 */
export async function addRoomRecord (info:any): Promise<boolean> {
  try {
    await rdb.insert(info)
    return true
  } catch (error) {
    // console.log('插入数据错误', error)
    return false
  }
}

/**
 * 获取指定群的聊天记录
 * @param room
 * @returns {Promise<*>}
 */
export async function getRoomRecord (roomName:any): Promise<any> {
  try {
    const search = await rdb.find({ roomName })
    return search
  } catch (error) {
    // console.log('查询数据错误', error)
  }
}

/**
 * 清楚指定群的聊天记录
 * @param roomName
 * @returns {Promise<void>}
 */
export async function removeRecord (roomName:any): Promise<void> {
  try {
    const search = await rdb.remove({ roomName }, { multi: true })
    return search
  } catch (e) {
    // console.log('error', e)
  }
}

/**
 * 获取指定群聊的所有聊天内容
 * @param rooName
 * @param day 取的天数
 * @returns {Promise<*>}
 */
export async function getRoomRecordContent (rooName:any, day:any): Promise<any> {
  try {
    let list = await getRoomRecord(rooName)
    list = list.filter((item:any) => {
      return item.time >= new Date().getTime() - day * 24 * 60 * 60 * 1000
    })
    let word = ''
    list.forEach((item:any) => {
      word = word + item.content
    })
    return word
  } catch (e) {
    // console.log('error', e)
  }
}
