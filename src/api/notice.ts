import { NoticeChat } from '../services/mod.js'
import { get, post } from '../utils/request.js'

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

// 获取定时任务列表服务接口
export const ServeGetNotices = () => {
  return get('/api/v1/notice/list')
}

// 创建定时任务服务接口
export const ServeCreateNotices = (data: {} | undefined) => {
  return post('/api/v1/notice/create', data)
}

// 删除定时任务服务接口
export const ServeDeleteNotices = (data: {} | undefined) => {
  return post('/api/v1/notice/delete', data)
}
