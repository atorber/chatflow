import { get, post } from '../utils/request.js'

// 获取问答列表服务接口
export const ServeGetWelcomes = () => {
  return get('/api/v1/welcome/list')
}

// 创建问答服务接口
export const ServeCreateWelcomes = (data: {} | undefined) => {
  return post('/api/v1/welcome/create', data)
}

// 删除问答服务接口
export const ServeDeleteWelcomes = (data: {} | undefined) => {
  return post('/api/v1/welcome/delete', data)
}
