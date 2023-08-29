/* eslint-disable no-console */
/* eslint-disable promise/always-return */
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

let httpClientInstance: any = null

export class HttpClient {

  private constructor () {}

  public static getInstance (): HttpClient {
    if (!httpClientInstance) {
      httpClientInstance = new HttpClient()
    }
    return httpClientInstance as HttpClient
  }

  public async makeRequest<T = any> (config: AxiosRequestConfig): Promise<T> {
    let response: AxiosResponse<T>
    try {
      response = await axios(config)
    } catch (error) {
      // Handle the error according to your application logic
      console.error(error)
      throw error
    }
    return response.data
  }

}

const httpClient = HttpClient.getInstance()

const config: AxiosRequestConfig = {
  method: 'get',
  url: 'https://api.github.com/users/octocat',
}

httpClient.makeRequest(config).then(response => {
  console.log(response)
}).catch(error => {
  console.error(error)
})
