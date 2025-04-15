import { get, post } from '../utils/request.js'

// 获取好友列表服务接口
export const ServeGetStatistics = () => {
  return get('/api/v1/statistic/list')
}

// 创建好友服务接口
export const ServeCreateStatistics = (data: {} | undefined) => {
  return post('/api/v1/statistic/create', data)
}

// 删除好友服务接口
export const ServeDeleteStatistics = (data: {} | undefined) => {
  return post('/api/v1/statistic/delete', data)
}
