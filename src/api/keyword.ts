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
