/* eslint-disable sort-keys */

import type {
  Sheet,
  // Field,
} from '../Model'

import { replaceSyncStatus, actionState } from '../actionBar.js'

const name = '智聊用户|ChatbotUser'
const code = 'chatBotUserSheet'

const vikaFields = {
  code: 200,
  success: true,
  data: {
    fields: [
      {
        id: 'fldA47yx9L3bk',
        name: '机器人ID|id',
        type: 'SingleText',
        property: {
          defaultValue: '',
        },
        editable: true,
        isPrimary: true,
      },
      {
        id: 'fldPrcQ5QfhxV',
        name: '昵称|botname',
        type: 'SingleText',
        property: {},
        editable: true,
      },
      {
        id: 'fld6rYKTZ0zQV',
        name: '用户ID|wxid',
        type: 'SingleText',
        property: {},
        editable: true,
      },
      {
        id: 'fldxD8wwu1hGy',
        name: '用户名称|name',
        type: 'SingleText',
        property: {},
        editable: true,
      },
      {
        id: 'fld4P2sX0CHco',
        name: '用户提示词|prompt',
        type: 'Text',
        editable: true,
      },
      {
        id: 'fldguMiluobGu',
        name: '配额|quota',
        type: 'Number',
        property: {
          precision: 0,
        },
        editable: true,
      },
      {
        id: 'fldUcpFFLyMo7',
        name: '启用状态|state',
        type: 'SingleSelect',
        property: {
          options: [
            {
              id: 'optMTJ3j2fMr4',
              name: '启用',
              color: {
                name: 'deepPurple_0',
                value: '#E5E1FC',
              },
            },
            {
              id: 'opt4bTBzh2Mx6',
              name: '禁用',
              color: {
                name: 'indigo_0',
                value: '#DDE7FF',
              },
            },
          ],
        },
        editable: true,
      },
      {
        id: 'fldsG69W4KzJa',
        name: '备注|info',
        type: 'Text',
        editable: true,
      },
    ],
  },
  message: 'SUCCESS',
}

let fields: any = vikaFields.data.fields

if (actionState[code]) {
  fields = replaceSyncStatus(fields)
}

const defaultRecords: any = {
  code: 200,
  success: true,
  data: { total: 0, records: [], pageNum: 1, pageSize: 0 },
  message: 'SUCCESS',
}

export const sheet: Sheet = {
  fields,
  name,
  defaultRecords: defaultRecords.data.records,
}
