/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-misused-promises */
import type { ResponseData } from './response'
import { TOKEN, EncodingAESKey } from './auth.js'
import { api, ApiTypes } from './API.js'
import type { QueryData } from './query'
import nJwt from 'njwt'
import request from 'request'

function checkInit () {
  let error = ''
  if (!TOKEN) {
    error = 'TOKEN不能为空，请先调用init方法初始化'
  }
  if (!EncodingAESKey) {
    error = 'EncodingAESKey不能为空，请先调用init方法初始化'
  }
  return error
}

function genToken (query: QueryData) {
  const jwt = nJwt.create(query as any, EncodingAESKey, 'HS256')
  const token = jwt.compact()
  return token
}

async function transferNLP<T extends keyof ApiTypes> (nlpType: T, query: QueryData) {
  return new Promise(async (resolve, reject) => {
    const error = checkInit()
    if (error) {
      reject(error)
      return
    }
    const token = genToken(query)
    await request.post(`${api[nlpType]}/${TOKEN}`, {
      json: {
        query: token,
      },
    }, (error: any, _stderr: any, stdout: ResponseData) => {
      if (error) {
        reject(error)
        return
      }
      resolve(stdout)
    })
  })
}

export { checkInit, genToken, transferNLP }
