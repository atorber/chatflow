import { DB } from '../db/nedb.js'
const cdb:any = new DB('config.db')
/**
 * 添加配置文件
 * @param {*} config
 */
async function addConfig (info:any) {
  try {
    const doc = await cdb.insert(info)
    return doc
  } catch (error) {
    // console.log('插入数据错误', error)
  }
}
/**
 * 更新配置文件
 * @param {*} config
 */
async function updateConfig (config: { id: any }) {
  try {
    const res = await allConfig()
    if (res) {
      const up = await cdb.update({ id: config.id }, config)
      return up
    } else {
      const add = await addConfig(config)
      return add
    }
  } catch (error) {
    // console.log('配置文件更新失败', error)
  }
}
/**
 * 获取所有配置
 */
async function allConfig () {
  try {
    const search = await cdb.find()
    return search[0]
  } catch (error) {
    // console.log('查询数据错误', error)
  }
}
/**
 * 每日任务
 */
async function dayTaskSchedule () {
  try {
    const res = await cdb.find({})
    return res[0].dayTaskSchedule
  } catch (error) {
    // console.log('获取每日任务', error)
  }
}
/**
 * 群资讯
 */
async function roomNewsSchedule () {
  try {
    const res = await cdb.find.find({})
    return res[0].roomNewsSchedule
  } catch (error) {
    // console.log('获取每日任务', error)
  }
}
/**
 * 群任务
 */
async function roomTaskSchedule () {
  try {
    const res = await cdb.find.find({})
    return res[0].roomTaskSchedule
  } catch (error) {
    // console.log('获取每日任务', error)
  }
}
export { addConfig }
export { updateConfig }
export { allConfig }
export { dayTaskSchedule }
export { roomNewsSchedule }
export { roomTaskSchedule }
export default {
  addConfig,
  allConfig,
  dayTaskSchedule,
  roomNewsSchedule,
  roomTaskSchedule,
  updateConfig,
}
