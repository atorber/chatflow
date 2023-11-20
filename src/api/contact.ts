/* eslint-disable no-console */
/* eslint-disable camelcase */
import { ContactChat } from '../services/mod.js'

// import { db } from '../db/tables.js'
// const contactData = db.contact

// 获取好友列表
export async function getContactList () {
  const contactListRaw:any = await ContactChat.findAll()
  // console.log('contactListRaw', JSON.stringify(contactListRaw))
  const contactList: any = contactListRaw.map((value: { fields: { name: any; avatar: any; gender: any; id: any; alias: any }; recordId: any }) => {
    if (value.fields.name) {
      return {
        avatar: value.fields.avatar,
        gender: value.fields.gender,
        group_id: 0,
        id: value.fields.id,
        is_online: 0,
        motto: '',
        nickname: value.fields.name,
        remark: value.fields.alias,
        recordId: value.recordId,
      }
    }
    return false
  }).filter((item: boolean) => item !== false)
  const data = {
    items: contactList,
  }
  return data
}

// 查询好友信息接口
export async function getContactInfo (_user_id:string) {
  const contactInfo:any = {
    avatar: '',
    email: 0,
    friend_apply: 0,
    friend_status: 1,
    gender: 0,
    group_id: 0,
    id: 4561,
    mobile: '17773011187',
    motto: '',
    nickname: '97',
    remark: '',
  }
  return contactInfo
}
