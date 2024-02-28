import axios, { AxiosInstance } from 'axios'

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
  private endpoint: string = 'http://localhost:9503/api/v1'

  private constructor () { // 步骤2：私有构造函数
    this.axiosInstance = axios.create({
      baseURL: this.endpoint, // 你的 API 基础地址
    })
  }

  public static getInstance (): AuthClient { // 步骤3：公共静态方法
    if (!AuthClient.instance) {
      AuthClient.instance = new AuthClient()
    }
    return AuthClient.instance
  }

  async login (username?: string, password?: string): Promise<void> {
    this.username = username || this.username
    this.password = password || this.password
    try {
      const response = await this.axiosInstance.post<TokenResponse>('/auth/login', {
        mobile: this.username,
        password: this.password,
      })
      this.token = response.data.data.access_token
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
