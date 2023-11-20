import { GroupNoticeChat } from '../services/mod.js'
// 获取群发通知列表
export const getGroupNoticeList = async (_data: any) => {
  const res = await GroupNoticeChat.db.findAll()
  return res
}

// 创建群发通知
export const createGroupNotice = (data: any) => {
  return data
}

// 删除群发通知
export const deleteGroupNotice = (data: any) => {
  return data
}
