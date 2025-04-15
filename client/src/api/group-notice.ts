import { get, post } from '../utils/request.js'

// 获取群发列表服务接口
export const ServeGetGroupnotices = () => {
  return get('/api/v1/groupnotice/list')
}

// 创建群发任务列表服务接口
export const ServeCreateGroupnotices = (data: {} | undefined) => {
  return post('/api/v1/groupnotice/create', data)
}

// 创建群发任务列表服务接口
export const ServeUpdateGroupnotices = (data: any[] | undefined) => {
  return post('/api/v1/groupnotice/update', data)
}

// 删除群发任务列表服务接口
export const ServeDeleteGroupnotices = (data: {} | undefined) => {
  return post('/api/v1/groupnotice/delete', data)
}
