import { get, post } from '../utils/request.js'
import { KeywordChat } from '../services/mod.js'
// 获取关键词列表
export const getKeywordList = async (_params: any) => {
  const res = await KeywordChat.db.findAll()
  return res
}

// 获取关键词提示文案
export const getKeywordTips = (params: any) => {
  return params
}

// 获取关键词列表服务接口
export const ServeGetKeywords = () => {
  return get('/api/v1/keyword/list')
}

// 创建关键词服务接口
export const ServeCreateKeywords = (data: {} | undefined) => {
  return post('/api/v1/keyword/create', data)
}

// 删除关键词服务接口
export const ServeDeleteKeywords = (data: {} | undefined) => {
  return post('/api/v1/keyword/delete', data)
}
