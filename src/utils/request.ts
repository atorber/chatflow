import axios from 'axios'
import getAuthClient from './auth.js'

const authClient = getAuthClient()

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: 'http://localhost:9503',

  // 请求超时时间
  timeout: 120000,
})

/**
 * 异常拦截处理器
 *
 * @param {*} error
 */
const errorHandler = (error: { response?: { status: number } }) => {
  // 判断是否是响应错误信息
  if (error.response) {
    if (error.response.status === 401) {
      authClient.delAccessToken()
    }
  }

  return Promise.reject(error)
}

// 请求拦截器
request.interceptors.request.use(async (config) => {
  const token = await authClient.getToken()

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }

  return config
}, errorHandler)

// 响应拦截器
request.interceptors.response.use((response) => response.data, errorHandler)

/**
 * GET 请求
 *
 * @param {String} url
 * @param {Object} data
 * @param {Object} options
 * @returns {Promise<any>}
 */
export const get = (url: string, data = {}, options = {}) => {
  return request({
    url,
    params: data,
    method: 'get',
    ...options,
  })
}

/**
 * POST 请求
 *
 * @param {String} url
 * @param {Object} data
 * @param {Object} options
 * @returns {Promise<any>}
 */
export const post = (url: string, data = {}, options = {}) => {
  return request({
    url,
    method: 'post',
    data,
    ...options,
  })
}

/**
 * 上传文件 POST 请求
 *
 * @param {String} url
 * @param {Object} data
 * @param {Object} options
 * @returns {Promise<any>}
 */
export const upload = (url: string, data = {}, options = {}) => {
  return request({
    url,
    method: 'post',
    data,
    ...options,
  })
}
