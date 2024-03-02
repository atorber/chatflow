import { get, post } from '../utils/request.js'

// 获取订单列表服务接口
export const ServeGetOrders = () => {
  return get('/api/v1/order/list')
}

// 创建订单服务接口
export const ServeCreateOrders = (data: {} | undefined) => {
  return post('/api/v1/order/create', data)
}

// 删除订单服务接口
export const ServeDeleteOrders = (data: {} | undefined) => {
  return post('/api/v1/order/delete', data)
}

// 获取订单列表
export const getOrderList = async (_params: any) => {
  const res = await ServeGetOrders()
  return res
}
