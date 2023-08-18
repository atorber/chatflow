import nedb from '../db/nedb.js'

const db:any = nedb('./contact.db')
async function addUser (info:any) {
  try {
    const doc = await db.insert(info)
    return doc
  } catch (error) {
    // console.log('插入数据错误', error)
  }
}
async function getUser () {
  try {
    const search = await db.find({})
    return search[0]
  } catch (error) {
    // console.log('查询数据错误', error)
  }
}
export { addUser }
export { getUser }
export default {
  addUser,
  getUser,
}
