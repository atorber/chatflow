import { WhiteListChat } from '../services/mod.js'
// 获取黑白名单
export const getWhiteList = async () => {
  const res = await WhiteListChat.db.findAll()
  return res
}

// 更新黑白名单
export const updateWhiteList = (data: any) => {
  return data
}

// 添加黑白名单
export const addWhiteList = (data: any) => {
  return data
}

// 移除黑白名单
export const deleteWhiteList = (data: any) => {
  return data
}
