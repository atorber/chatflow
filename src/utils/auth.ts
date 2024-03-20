/* eslint-disable no-console */
import axios, { AxiosInstance } from 'axios'
import { logForm } from './utils.js'
import 'dotenv/config.js'

interface TokenResponse {
  code: number;
  message: string;
  data: {
    access_token: string;
    expires_in: number; // 假设 expiresIn 是以秒为单位的过期时间
    type: string;
  };
}

class AuthClient {

  private static instance: AuthClient | undefined // 步骤1：私有静态实例
  private axiosInstance: AxiosInstance
  private token: string | null = null
  private tokenExpirationDate: Date | null = null
  private username: string = ''
  private password: string = ''
  endpoint: string = 'http://127.0.0.1:9503'

  private constructor (ops?:{
    username:string;
    password:string,
    endpoint:string
  }) { // 步骤2：私有构造函数
    if (ops) {
      this.username = ops.username
      this.password = ops.password
      this.endpoint = ops.endpoint
    }
    this.axiosInstance = axios.create({
      baseURL: this.endpoint, // 你的 API 基础地址
    })
  }

  public static getInstance (ops?:{
    username:string;
    password:string,
    endpoint:string
  }): AuthClient { // 步骤3：公共静态方法
    if (!AuthClient.instance) {
      AuthClient.instance = new AuthClient(ops)
    }
    return AuthClient.instance
  }

  async login (username?: string, password?: string): Promise<any> {
    this.username = username || this.username
    this.password = password || this.password
    try {
      const response = await this.axiosInstance.post<TokenResponse>('/api/v1/auth/login', {
        mobile: this.username,
        password: this.password,
      })
      if (response.data.data.access_token) {
        logForm('登录成功' + JSON.stringify(response.data))
        this.token = response.data.data.access_token
        this.tokenExpirationDate = new Date(new Date().getTime() + response.data.data.expires_in * 1000)
        return response.data
      } else {
        logForm('登录失败' + JSON.stringify(response.data))
        throw new Error(JSON.stringify(response.data))
      }
    } catch (error) {
      logForm('登录失败' + JSON.stringify(error))
      throw error
    }
  }

  async init (username?: string, password?: string):Promise<any> {
    this.username = username || this.username
    this.password = password || this.password
    try {
      const response:{data:{message:string}} = await this.axiosInstance.post<TokenResponse>('/api/v1/auth/init', {
        mobile: this.username,
        password: this.password,
      })
      // logForm('系统初始化完成' + JSON.stringify(response.data))
      return response
    } catch (error) {
      logForm('系统初始化失败' + JSON.stringify(error))
      return error
    }
  }

  private async refreshTokenIfNeeded (): Promise<void> {
    if (!this.token || !this.tokenExpirationDate || new Date() >= this.tokenExpirationDate) {
      // logForm('token已过期，刷新token:\n' + this.token)
      await this.login()
    } else {
      // logForm('token未过期，无需刷新:\n' + this.token)
    }
  }

  public async makeAuthenticatedRequest (path: string, method: 'GET' | 'POST' = 'GET', data?: any): Promise<any> {
    await this.refreshTokenIfNeeded()
    return this.axiosInstance.request({
      url: this.endpoint + path,
      method,
      data,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })
  }

  public async getToken (): Promise<string|undefined> {
    try {
      await this.refreshTokenIfNeeded()
      return this.token as string
    } catch (error) {
      console.error('获取token失败', error)
      return undefined
    }
  }

  public delAccessToken (): void {
    this.token = null
    this.tokenExpirationDate = null
  }

}

export default AuthClient.getInstance // 修改导出方式，导出getInstance方法
