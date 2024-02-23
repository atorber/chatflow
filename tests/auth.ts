/* eslint-disable no-console */
// 实现一个类，请求登录接口获得token，自动更新token、当token过期时自动重新请求token
import axios, { AxiosInstance } from 'axios'
import 'dotenv/config.js'  // 导入环境变量配置

interface TokenResponse {
  code: number
  message: string
  data:{
    access_token: string;
    expires_in: number; // 假设 expiresIn 是以秒为单位的过期时间
    type: string;
  }
}

class AuthClient {

  private axiosInstance: AxiosInstance
  private token: string | null = null
  private tokenExpirationDate: Date | null = null
  private username: string = ''
  private password: string = ''
  private endpoint: string = 'http://localhost:9503/api/v1'

  constructor () {
    this.axiosInstance = axios.create({
      baseURL: this.endpoint, // 你的 API 基础地址
    })
  }

  async login (username?: string, password?: string): Promise<void> {
    this.username = username || this.username
    this.password = password || this.password
    try {
      const response = await this.axiosInstance.post<TokenResponse>('/auth/login', {
        // 你的登录凭证，如用户名和密码
        mobile: this.username,
        password: this.password,
      })
      console.log('登录成功', response.data)
      this.token = response.data.data.access_token
      // 设置 token 过期时间
      this.tokenExpirationDate = new Date(new Date().getTime() + response.data.data.expires_in * 1000)
    } catch (error) {
      console.error('登录失败', error)
      throw error
    }
  }

  private async refreshTokenIfNeeded (): Promise<void> {
    if (!this.token || !this.tokenExpirationDate || new Date() >= this.tokenExpirationDate) {
      await this.login()
    }
  }

  public async makeAuthenticatedRequest (path:string, method: 'GET' | 'POST' = 'GET', data?: any): Promise<any> {
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

  // 获取token，如果没有token或者token过期，会自动请求新的token
  public async getToken (): Promise<string> {
    await this.refreshTokenIfNeeded()
    return this.token as string
  }

}

export default AuthClient

// 使用示例

const authClient = new AuthClient()
await authClient.login(process.env.VIKA_SPACE_ID, process.env.VIKA_TOKEN)
const token = await authClient.getToken()
console.log('token:', token)

// 获取用户信息
const resUserInfo = await authClient.makeAuthenticatedRequest('/users/detail')
console.log('resUserInfo:', JSON.stringify(resUserInfo.data, null, 2))

// 获取用户配置
const resConfig = await authClient.makeAuthenticatedRequest('/users/config')
console.log('resConfig:', JSON.stringify(resConfig.data, null, 2))

// 获取/notice/list
const resNoticeList = await authClient.makeAuthenticatedRequest('/notice/list')
console.log('resNoticeList:', JSON.stringify(resNoticeList.data, null, 2))

// 获取/whitelist/list/white
const resWhiteList = await authClient.makeAuthenticatedRequest('/whitelist/list/white')
console.log('resWhiteList:', JSON.stringify(resWhiteList.data, null, 2))
