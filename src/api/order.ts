import { OrderChat } from '../services/mod.js'
// 获取订单列表
export const getOrderList = async (_params: any) => {
  const res = await OrderChat.db.findAll()
  return res
}

// 获取订单详情
export const getOrderDetail = (params: any) => {
  return params
}

// 创建订单
export const createOrder = (data: any) => {
  return data
}

// 取消订单
export const cancelOrder = (data: any) => {
  return data
}

// 删除订单
export const deleteOrder = (data: any) => {
  return data
}

// 更新订单
export const updateOrder = (data: any) => {
  return data
}
