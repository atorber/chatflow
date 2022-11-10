import { ResponseData } from './response'
import { TOKEN, EncodingAESKey } from './auth'
import { api, ApiTypes } from './API'
import { QueryData } from './query'
const nJwt = require('njwt')
const request = require('request')

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
  const jwt = nJwt.create(query, EncodingAESKey, 'HS256')
  const token = jwt.compact()
  return token
}

async function transferAIBOT<T extends keyof ApiTypes> (nlpType: T, query: QueryData) {
  return new Promise(async (resolve, reject) => {
    const error = checkInit()
    if (error) {
      reject(error)
      return
    }
    await request.post(`${api[nlpType]}/${TOKEN}`, {
      json: query,
    }, (error: any, stderr: any, stdout: ResponseData) => {
      if (error) {
        reject(error)
        return
      }
      resolve(stdout)
    })
  })
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
    }, (error: any, stderr: any, stdout: ResponseData) => {
      if (error) {
        reject(error)
        return
      }
      resolve(stdout)
    })
  })
}

export {
  checkInit,
  genToken,
  transferNLP,
  transferAIBOT,
}
