/* eslint-disable no-console */
import axios from 'axios'
import getAuthClient from './auth.js'
import 'dotenv/config.js'
import { ChatFlowCore } from '../api/base-config.js'

function markAuthRetry (config: unknown): boolean {
  if (!config || typeof config !== 'object') return false
  const retryConfig = config as { __chatFlowAuthRetried?: boolean }
  if (retryConfig.__chatFlowAuthRetried) return false
  retryConfig.__chatFlowAuthRetried = true
  return true
}

/**
 * GET 请求
 *
 * @param {String} url
 * @param {Object} data
 * @param {Object} options
 * @returns {Promise<any>}
 */
export const get = (url: string, data = {}, options = {}) => {
  // 创建 axios 实例
  const request = axios.create({
  // API 请求的默认前缀
    baseURL: getAuthClient()?.endpoint || 'http://127.0.0.1:9503',

    // 请求超时时间
    timeout: 120000,
  })

  /**
 * 异常拦截处理器
 *
 * @param {*} error
 */
  const errorHandler = (error: { response?: { status: number, config:any }; message?: string }) => {
    const status = error.response?.status
    ChatFlowCore.logger.error(`请求异常${status ? ` status=${status}` : ''}: ${error.message || 'request failed'}`)
    if (status === 401 && markAuthRetry(error.response?.config)) {
      getAuthClient()?.delAccessToken()
      return request(error.response!.config)
    }
    return Promise.reject(error)
  }

  // 请求拦截器
  request.interceptors.request.use(async (config) => {
    const token = await getAuthClient()?.getToken()

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    return config
  }, errorHandler)

  // 响应拦截器
  request.interceptors.response.use((response) => {
    ChatFlowCore.logger.info(`${response.config.method} response (status ${response.status})`)
    if (response.data && response.data.message === 'Unauthorized' && response.data.statusCode === 401) {
      if (!markAuthRetry(response.config)) {
        return Promise.reject(new Error('Unauthorized after authentication retry'))
      }
      getAuthClient()?.delAccessToken()
      return request(response.config)
    }
    return response.data
  }, errorHandler)

  // request.interceptors.response.use((response) => response.data, errorHandler)
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
  // 创建 axios 实例
  const request = axios.create({
  // API 请求的默认前缀
    baseURL: getAuthClient()?.endpoint || 'http://127.0.0.1:9503',

    // 请求超时时间
    timeout: 120000,
  })

  /**
 * 异常拦截处理器
 *
 * @param {*} error
 */
  const errorHandler = (error: { response?: { status: number, config:any }; message?: string }) => {
    const status = error.response?.status
    ChatFlowCore.logger.error(`请求异常${status ? ` status=${status}` : ''}: ${error.message || 'request failed'}`)
    if (status === 401 && markAuthRetry(error.response?.config)) {
      getAuthClient()?.delAccessToken()
      return request(error.response!.config)
    }
    return Promise.reject(error)
  }

  // 请求拦截器
  request.interceptors.request.use(async (config) => {
    const token = await getAuthClient()?.getToken()

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    return config
  }, errorHandler)

  // 响应拦截器
  request.interceptors.response.use((response) => {
    ChatFlowCore.logger.info(`${response.config.method} response (status ${response.status})`)
    if (response.data && response.data.message === 'Unauthorized' && response.data.statusCode === 401) {
      if (!markAuthRetry(response.config)) {
        return Promise.reject(new Error('Unauthorized after authentication retry'))
      }
      getAuthClient()?.delAccessToken()
      return request(response.config)
    }
    return response.data
  }, errorHandler)

  // request.interceptors.response.use((response) => response.data, errorHandler)
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
  // 创建 axios 实例
  const request = axios.create({
  // API 请求的默认前缀
    baseURL: getAuthClient()?.endpoint || 'http://127.0.0.1:9503',

    // 请求超时时间
    timeout: 120000,
  })

  /**
 * 异常拦截处理器
 *
 * @param {*} error
 */
  const errorHandler = (error: { response?: { status: number, config:any }; message?: string }) => {
    const status = error.response?.status
    ChatFlowCore.logger.error(`请求异常${status ? ` status=${status}` : ''}: ${error.message || 'request failed'}`)
    if (status === 401 && markAuthRetry(error.response?.config)) {
      getAuthClient()?.delAccessToken()
      return request(error.response!.config)
    }
    return Promise.reject(error)
  }

  // 请求拦截器
  request.interceptors.request.use(async (config) => {
    const token = await getAuthClient()?.getToken()

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    return config
  }, errorHandler)

  // 响应拦截器
  request.interceptors.response.use((response) => {
    ChatFlowCore.logger.info(`${response.config.method} response (status ${response.status})`)
    if (response.data && response.data.message === 'Unauthorized' && response.data.statusCode === 401) {
      if (!markAuthRetry(response.config)) {
        return Promise.reject(new Error('Unauthorized after authentication retry'))
      }
      getAuthClient()?.delAccessToken()
      return request(response.config)
    }
    return response.data
  }, errorHandler)

  // request.interceptors.response.use((response) => response.data, errorHandler)
  return request({
    url,
    method: 'post',
    data,
    ...options,
  })
}
