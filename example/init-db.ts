#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import 'dotenv/config.js'

import {
  logForm,
  init,
} from '../src/chatflow.js'

const main = async () => {

  // 从环境变量中获取配置信息, 在环境变量中已经配置了以下信息或者直接赋值
  const VIKA_SPACE_ID = process.env['VIKA_SPACE_ID']
  const VIKA_TOKEN = process.env['VIKA_TOKEN']

  // 初始化检查数据库表，如果不存在则创建
  try {
    await init({
      spaceId: VIKA_SPACE_ID,
      token: VIKA_TOKEN,
    })
  } catch (e) {
    logForm('初始化检查失败：' + JSON.stringify(e))
  }
}

void main()
