import { get, post } from '../utils/request.js'

// 获取问答列表服务接口
export const ServeGetMedias = (data:any) => {
  return get('/api/v1/media/list', data)
}

// 创建问答服务接口
export const ServeCreateMedias = (data: {} | undefined) => {
  return post('/api/v1/media/create', data)
}

// 删除问答服务接口
export const ServeDeleteMedias = (data: {} | undefined) => {
  return post('/api/v1/media/delete', data)
}
