/* eslint-disable no-console */
import { post, get } from '../utils/request.js'

// 查询用户信息接口
export const getUserInfo = (_params: any) => {
  const data = {
    avatar: 'https://im.gzydong.com/public/media/image/avatar/20230530/f76a14ce98ca684752df742974f5473a_200x200.png',
    birthday: '2023-06-11',
    email: '837215079@qq.com',
    gender: 2,
    id: 2055,
    mobile: '18798272055',
    motto: '是的发送到发送到发',
    nickname: '老牛逼了',
  }
  return data
}

// 修改密码服务接口
export const ServeUpdatePassword = (data: {} | undefined) => {
  return post('/api/v1/users/change/password', data)
}

// 修改手机号服务接口
export const ServeUpdateMobile = (data: {} | undefined) => {
  return post('/api/v1/users/change/mobile', data)
}

// 修改手机号服务接口
export const ServeUpdateEmail = (data: {} | undefined) => {
  return post('/api/v1/users/change/email', data)
}

// 修改个人信息服务接口
export const ServeUpdateUserDetail = (data: {} | undefined) => {
  return post('/api/v1/users/change/detail', data)
}

// 查询用户信息服务接口
export const ServeGetUserDetail = () => {
  return get('/api/v1/users/detail')
}

// 获取用户相关设置信息
export const ServeGetUserSetting = () => {
  return get('/api/v1/users/setting')
}

// 获取用户相关系统配置信息
export const ServeGetUserConfig = () => {
  return get('/api/v1/users/config')
}

// 获取用户相关系统配置信息分组
export const ServeGetUserConfigGroup = () => {
  return get('/api/v1/users/config/group')
}

// 获取用户相关系统配置信息
export const ServeGetUserConfigObj = () => {
  return get('/api/v1/users/config/keys')
}

// 修改配置服务接口
export const ServeUpdateConfig = (data: {} | undefined) => {
  return post('/api/v1/users/config', data)
}

export const ServeGetUserConfigBykey = (data: {key:string;value:string}) => {
  return post('/api/v1/users/config/bykey', data)
}
