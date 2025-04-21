/* eslint-disable sort-keys */

import type {
  Sheet,
  // Field,
} from '../Model';

import { replaceSyncStatus, actionState } from '../actionBar.js';

const name = '智聊|Chatbot';
const code = 'chatBotSheet';

const vikaFields = {
  code: 200,
  success: true,
  data: {
    fields: [
      {
        id: 'fldA47yx9L3bk',
        name: '机器人ID|id',
        type: 'AutoNumber',
        editable: false,
        isPrimary: true,
      },
      {
        id: 'fldPrcQ5QfhxV',
        name: '昵称|name',
        type: 'SingleText',
        property: {},
        editable: true,
      },
      {
        id: 'fld6rYKTZ0zQV',
        name: '描述|desc',
        type: 'Text',
        editable: true,
      },
      {
        id: 'fldxD8wwu1hGy',
        name: '类型|type',
        type: 'SingleSelect',
        property: {
          options: [
            {
              id: 'opt1LUWhuInQB',
              name: 'ChatGPT',
              color: {
                name: 'deepPurple_0',
                value: '#E5E1FC',
              },
            },
            {
              id: 'optMmnD7Lx6dp',
              name: '文心一言',
              color: {
                name: 'indigo_0',
                value: '#DDE7FF',
              },
            },
            {
              id: 'optOyZnLw4AZJ',
              name: '扣子',
              color: {
                name: 'blue_0',
                value: '#DDF5FF',
              },
            },
          ],
        },
        editable: true,
      },
      {
        id: 'fldRVqJtsrH0H',
        name: '模型|model',
        type: 'SingleText',
        property: {},
        editable: true,
      },
      {
        id: 'fld4P2sX0CHco',
        name: '系统提示词|prompt',
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
        id: 'fld7aHIRIo4Sj',
        name: '接入点|endpoint',
        type: 'SingleText',
        property: {},
        editable: true,
      },
      {
        id: 'fldcZcmi2z6ZE',
        name: '密钥|key',
        type: 'SingleText',
        property: {},
        editable: true,
      },
    ],
  },
  message: 'SUCCESS',
};

let fields: any = vikaFields.data.fields;

if (actionState[code]) {
  fields = replaceSyncStatus(fields);
}

const defaultRecords: any = {
  code: 200,
  success: true,
  message: 'Request successful',
  data: {
    total: 1,
    pageNum: 1,
    pageSize: 1,
    records: [
      {
        recordId: 'rec4KyET4ALNJ',
        fields: {
          '昵称|name': '小G',
          '描述|desc': '示例配置数据',
          '类型|type': 'ChatGPT',
          '模型|model': 'gpt-3.5-turbo',
          '系统提示词|prompt': '你是智能助手小G',
          '配额|quota': 99999999,
          '接入点|endpoint': 'https://api.gptgod.online',
          '密钥|key': 'sk-Glz4aVRaiXT7AyPH7E7xxxxxx7zQRXxxxxxkuycUi',
        },
      },
    ],
  },
};

export const sheet: Sheet = {
  fields,
  name,
  defaultRecords: defaultRecords.data.records,
};
