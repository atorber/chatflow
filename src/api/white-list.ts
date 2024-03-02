import { get, post } from '../utils/request.js'

// 获取黑白名单
export const getWhiteList = async () => {
  const res = await ServeGetWhitelistWhite()
  return res
}

// 更新黑白名单
export const updateWhiteList = (data: any) => {
  return data
}

// 添加黑白名单
export const addWhiteList = (data: any) => {
  return data
}

// 移除黑白名单
export const deleteWhiteList = (data: any) => {
  return data
}

// 获取白名单列表服务接口
export const ServeGetWhitelistWhite = () => {
  return get('/api/v1/whitelist/list/white')
}

// 创建黑名单列表服务接口
export const ServeCreateWhitelistWhite = (data: {} | undefined) => {
  return post('/api/v1/whitelist/list/white/create', data)
}

// 删除黑名单列表服务接口
export const ServeDeleteWhitelistWhite = (data: {} | undefined) => {
  return post('/api/v1/whitelist/list/white/delete', data)
}

// 获取黑名单列表服务接口
export const ServeGetWhitelistBlack = (data: {} | undefined) => {
  return get('/api/v1/whitelist/list/black', data)
}
