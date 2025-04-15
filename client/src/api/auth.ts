import {
  post,
  // get,
} from '../utils/request.js'

// 初始化创建表
export const ServeUpdatePassword = (data: {} | undefined) => {
  return post('/api/v1/auth/init', data)
}

// 用户登录
export const login = async (
  param:{
    mobile:string,
    password:string,
    platform?:string
}) => {
  let data = {}
  if (param.mobile && param.mobile) {
    data = {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJndWFyZCI6ImFwaSIsImlzcyI6ImltLndlYiIsImV4cCI6MTcyMTA3MDkwNCwiaWF0IjoxNjg1MDcwOTA0LCJqdGkiOiIyMDU0In0.-Mk4a20gur-QPxlYjgYc_eHWpWkDURJTawO0yBQ_b2g',
      expires_in: 36000000,
      type: 'Bearer',
    }
  }

  return data
}

// 退出登录
export const logout = async () => {
  return 'success'
}

// 刷新登录Token接口
export const refreshToken = async (token:string) => {
  return token
}
