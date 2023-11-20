import { StatisticChat } from '../services/mod.js'
// 获取统计打卡列表
export const getStatisticList = async (_params: any) => {
  const res = await StatisticChat.db.findAll()
  return res
}

// 创建统计打卡
export const createStatistic = (data: any) => {
  return data
}

// 删除统计打卡
export const deleteStatistic = (data: any) => {
  return data
}

// 更新统计打卡
export const updateStatistic = (data: any) => {
  return data
}
