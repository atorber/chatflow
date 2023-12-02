import { NoticeChat } from '../services/mod.js'
// 获取定时提醒列表
export const getNoticeList = async (_params: any) => {
  const res = await NoticeChat.db.findAll()
  return res
}

// 创建定时提醒
export const createNotice = (data: any) => {
  return data
}

// 删除定时提醒
export const deleteNotice = (data: any) => {
  return data
}

// 更新定时提醒
export const updateNotice = (data: any) => {
  return data
}
