/* eslint-disable sort-keys */

import type {
  Sheet,
  // Field,
} from '../Model'

import fs from 'fs'

import path from 'path'
import { replaceSyncStatus, actionState } from '../actionBar.js'

const name = '统计打卡|Statistic'
const code = 'statisticSheet'

// 创建一个获取当前目录的函数
const getCurrentDir = () => {
  const err = new Error()
  const stack = err.stack?.split('\n')
  // 寻找调用这个函数的位置
  const callerLine = stack?.find(line => line.includes('at'))
  const match = callerLine?.match(/\((.*):[0-9]+:[0-9]+\)/)
  return match ? path.dirname(match[1] || '') : undefined
}

// 使用函数获取当前目录
const currentDir = getCurrentDir() || ''
const vikaFields = JSON.parse(fs.readFileSync(path.join(currentDir, 'fields.json'), 'utf-8'))
let fields = vikaFields.data.fields

if (actionState[code]) {
  fields = replaceSyncStatus(fields)
}

const defaultRecords = JSON.parse(fs.readFileSync(path.join(currentDir, 'records.json'), 'utf-8'))

export const sheet: Sheet = {
  fields,
  name,
  defaultRecords:defaultRecords.data.records,
}
