import { get, post } from '../utils/request.js'

// 获取问答列表服务接口
export const ServeGetCarpoolings = (data:any) => {
  return get('/api/v1/carpooling/list', data)
}

// 创建问答服务接口
export const ServeCreateCarpoolings = (data: {} | undefined) => {
  return post('/api/v1/carpooling/create', data)
}

// 删除问答服务接口
export const ServeDeleteCarpoolings = (data: {} | undefined) => {
  return post('/api/v1/carpooling/delete', data)
}
