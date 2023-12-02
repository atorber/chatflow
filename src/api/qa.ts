import { QaChat } from '../services/mod.js'
// 获取问答列表
export const getQaList = async (_params: any) => {
  const res = await QaChat.db.findAll()
  return res
}

// 添加问题
export const addQa = (data: any) => {
  return data
}

// 删除问题
export const deleteQa = (data: any) => {
  return data
}

// 更新问题
export const updateQa = (data: any) => {
  return data
}

// 发布问题
export const publishQa = (data: any) => {
  return data
}
