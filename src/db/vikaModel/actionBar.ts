/* eslint-disable sort-keys */
import fs from 'fs'

import path from 'path'

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
const acitonFields = JSON.parse(fs.readFileSync(path.join(currentDir, 'actionBar.json'), 'utf-8'))
const fieldsOnly = acitonFields.data.fields

interface CustomObject {
    name: string;
    value?: string;
    [key: string]: any;
  }

export const actionState = {
  qaSheet:true,
  orderSheet:false,
  keywordSheet:false,
  envSheet:true,
  contactSheet:false,
  roomSheet:false,
  whiteListSheet:true,
  noticeSheet:true,
  statisticSheet:true,
  groupNoticeSheet:true,
  messageSheet:false,
}

export function replaceSyncStatus (fields: CustomObject[]): CustomObject[] {
// 替换已定义的属性
  const newfields = fields.map((item) => {
    if (item.name === '同步状态|syncStatus') {
      const replacement = fieldsOnly.find((bItem: { name: string }) => bItem.name === '同步状态|syncStatus')
      return replacement
    }

    if (item.name === '最后操作时间|lastOperationTime') {
      const replacement = fieldsOnly.find((bItem: { name: string }) => bItem.name === '最后操作时间|lastOperationTime')
      return replacement
    }

    if (item.name === '操作|action') {
      const replacement = fieldsOnly.find((bItem: { name: string }) => bItem.name === '操作|action')
      return replacement
    }

    return item
  })

  //   补充缺失的属性
  for (const field of fieldsOnly) {
    if ([ '同步状态|syncStatus', '操作|action', '最后操作时间|lastOperationTime' ].includes(field.name)) {
      const replacement = newfields.find((bItem: { name: string }) => bItem.name === field.name)
      if (!replacement) {
        newfields.push(field)
      }
    }
  }
  return newfields
}
