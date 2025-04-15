import { get, post } from '../utils/request.js'

// 获取问答列表服务接口
export const ServeGetQas = () => {
  return get('/api/v1/qa/list')
}

// 创建问答服务接口
export const ServeCreateQas = (data: {} | undefined) => {
  return post('/api/v1/qa/create', data)
}

// 删除问答服务接口
export const ServeDeleteQas = (data: {} | undefined) => {
  return post('/api/v1/qa/delete', data)
}
