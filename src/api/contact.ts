/* eslint-disable no-console */
/* eslint-disable camelcase */
import { post, get } from '../utils/request.js'

// 获取好友列表服务接口
export const ServeGetContacts = () => {
  return get('/api/v1/contact/list')
}

// 获取好友列表服务接口
export const ServeGetContactsRaw = () => {
  return get('/api/v1/contact/list/raw')
}

// 好友更新
export const ServeCreateContactBatch = (data: {} | undefined) => {
  return post('/api/v1/contact/create/batch', data)
}

// 解除好友关系服务接口
export const ServeDeleteContact = (data: any | undefined) => {
  return post('/api/v1/contact/delete', data)
}

// 解除好友关系服务接口批量
export const ServeDeleteBatchContact = (data: any | undefined) => {
  return post('/api/v1/contact/deleteBatch', data)
}

// 更新好友服务接口
export const ServeUpdateContact = (data: {} | undefined) => {
  return post('/api/v1/contact/update', data)
}

// 修改好友备注服务接口
export const ServeEditContactRemark = (data: {} | undefined) => {
  return post('/api/v1/contact/edit-remark', data)
}

// 搜索联系人
export const ServeSearchContact = (data: {} | undefined) => {
  return get('/api/v1/contact/search', data)
}

// 好友申请服务接口
export const ServeCreateContact = (data: {} | undefined) => {
  return post('/api/v1/contact/apply/create', data)
}

// 查询好友申请服务接口
export const ServeGetContactApplyRecords = (data: {} | undefined) => {
  return get('/api/v1/contact/apply/records', data)
}

// 处理好友申请服务接口
export const ServeApplyAccept = (data: {} | undefined) => {
  return post('/api/v1/contact/apply/accept', data)
}

export const ServeApplyDecline = (data: {} | undefined) => {
  return post('/api/v1/contact/apply/decline', data)
}

// 查询好友申请未读数量服务接口
export const ServeFindFriendApplyNum = () => {
  return get('/api/v1/contact/apply/unread-num')
}

// 搜索用户信息服务接口
export const ServeSearchUser = (data: {} | undefined) => {
  return get('/api/v1/contact/detail', data)
}

// 搜索用户信息服务接口
export const ServeContactGroupList = (data?: any) => {
  return get('/api/v1/contact/group/list', data)
}

export const ServeContactMoveGroup = (data: {} | undefined) => {
  return post('/api/v1/contact/move-group', data)
}

export const ServeContactGroupSave = (data: {} | undefined) => {
  return post('/api/v1/contact/group/save', data)
}

// import { db } from '../db/tables.js'
// const contactData = db.contact

// 获取好友列表
export async function getContactList () {
  const res = await ServeGetContacts()
  const contactListRaw:any = res.data.items
  // console.log('contactListRaw', JSON.stringify(contactListRaw))
  const contactList: any = contactListRaw.map((fields: { name: any; avatar: any; gender: any; id: any; alias: any ; recordId: any }) => {
    if (fields.name) {
      return {
        avatar: fields.avatar,
        gender: fields.gender,
        group_id: 0,
        id: fields.id,
        is_online: 0,
        motto: '',
        nickname: fields.name,
        remark: fields.alias,
        recordId: fields.recordId,
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
