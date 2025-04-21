/* eslint-disable sort-keys */

/* eslint-disable sort-keys */

import type {
  Sheet,
  // Field,
} from '../Model';

const vikaFields = {
  code: 200,
  success: true,
  data: {
    fields: [
      {
        id: 'flduc4igEtLoQ',
        name: '指令名称|name',
        type: 'SingleText',
        property: { defaultValue: '' },
        editable: true,
        isPrimary: true,
      },
      { id: 'fldDb690A0L1E', name: '说明|desc', type: 'Text', editable: true },
      {
        id: 'fld4yqz6uYHkG',
        name: '类型|type',
        type: 'SingleSelect',
        property: {
          options: [
            {
              id: 'optYt6uOH8l0d',
              name: '系统指令',
              color: { name: 'deepPurple_0', value: '#E5E1FC' },
            },
            {
              id: 'optWlKdyBNqAu',
              name: '群指令',
              color: { name: 'indigo_0', value: '#DDE7FF' },
            },
            {
              id: 'optHxBUHWIqEM',
              name: '包含关键字',
              color: { name: 'blue_0', value: '#DDF5FF' },
            },
            {
              id: 'optyuKwsQmtwj',
              name: '等于关键字',
              color: { name: 'teal_0', value: '#D6F3E8' },
            },
          ],
        },
        editable: true,
      },
      {
        id: 'fldx5tKkVIDj7',
        name: '详细说明|details',
        type: 'Text',
        editable: true,
      },
    ],
  },
  message: 'SUCCESS',
};
const defaultRecords: any = {
  code: 200,
  success: true,
  data: {
    total: 15,
    records: [
      {
        recordId: 'recdho2WB2iS2',
        createdAt: 1702519534000,
        updatedAt: 1702519534000,
        fields: {
          '指令名称|name': '帮助',
          '详细说明|details': '获得操作指令集',
          '类型|type': '系统指令',
          '说明|desc': '获得操作指令集',
        },
      },
      {
        recordId: 'recmhneDbSRB4',
        createdAt: 1702519534000,
        updatedAt: 1702519534000,
        fields: {
          '指令名称|name': '更新配置',
          '详细说明|details':
            '更新系统配置，更改配置后需主动更新一次配置配置才会生效',
          '类型|type': '系统指令',
          '说明|desc': '更新系统环境变量配置',
        },
      },
      {
        recordId: 'recNqfyD7csbV',
        createdAt: 1702519534000,
        updatedAt: 1702522231000,
        fields: {
          '指令名称|name': '更新定时提醒',
          '详细说明|details': '更新定时提醒任务',
          '类型|type': '系统指令',
          '说明|desc': '更新定时提醒任务',
        },
      },
      {
        recordId: 'recRoBg7h5xRq',
        createdAt: 1702519534000,
        updatedAt: 1702522214000,
        fields: {
          '指令名称|name': '更新通讯录',
          '详细说明|details': '更新机器人的群列表和好友列表',
          '类型|type': '系统指令',
          '说明|desc': '更新机器人的群列表和好友列表',
        },
      },
      {
        recordId: 'recm29CFVCQVj',
        createdAt: 1702519534000,
        updatedAt: 1702522214000,
        fields: {
          '指令名称|name': '更新白名单',
          '详细说明|details': '下载通讯录xlsx表',
          '类型|type': '系统指令',
          '说明|desc': '更新群白名单',
        },
      },
      {
        recordId: 'rec1FDwXmDbWn',
        createdAt: 1702519534000,
        updatedAt: 1702522214000,
        fields: {
          '指令名称|name': '更新活动',
          '详细说明|details': '下载通知模板',
          '类型|type': '系统指令',
          '说明|desc': '更新活动列表',
        },
      },
      {
        recordId: 'recmjs7ZxTPqp',
        createdAt: 1702519534000,
        updatedAt: 1702522214000,
        fields: {
          '指令名称|name': '群发通知',
          '详细说明|details': '更新活跃的活动到数据库',
          '类型|type': '系统指令',
          '说明|desc': '群发通知给群或好友',
        },
      },
      {
        recordId: 'recMN5yR7RU8n',
        createdAt: 1702519534000,
        updatedAt: 1702522214000,
        fields: {
          '指令名称|name': '更新问答',
          '详细说明|details':
            '将群发通知表中状态为待发送状态的全部消息进行群发',
          '类型|type': '系统指令',
          '说明|desc': '问答列表更新到微信对话开放平台',
        },
      },
      {
        recordId: 'recQQ78Jq2RuL',
        createdAt: 1702519534000,
        updatedAt: 1702522214000,
        fields: {
          '指令名称|name': '下载csv通讯录',
          '详细说明|details': '更新定时提醒任务',
          '类型|type': '系统指令',
          '说明|desc': '下载通讯录csv表',
        },
      },
      {
        recordId: 'reczSuluij0Og',
        createdAt: 1702519534000,
        updatedAt: 1702522214000,
        fields: {
          '指令名称|name': '下载通讯录',
          '详细说明|details': '下载csv格式的通讯录，包括群和好友',
          '类型|type': '系统指令',
          '说明|desc': '下载通讯录xlsx表',
        },
      },
      {
        recordId: 'recwV9scKIOMP',
        createdAt: 1702519536000,
        updatedAt: 1702522214000,
        fields: {
          '指令名称|name': '下载通知模板',
          '详细说明|details': '更新群白名单，白名单变动时需主动更新白名单',
          '类型|type': '系统指令',
          '说明|desc': '下载通知模板',
        },
      },
      {
        recordId: 'recggU14qQNeK',
        createdAt: 1702519536000,
        updatedAt: 1702522214000,
        fields: {
          '指令名称|name': '启用问答',
          '详细说明|details': 'TBD当前群启用智能问答',
          '类型|type': '群指令',
          '说明|desc': 'TBD当前群启用智能问答',
        },
      },
      {
        recordId: 'recsKTrolW8lR',
        createdAt: 1702519536000,
        updatedAt: 1702522214000,
        fields: {
          '指令名称|name': '关闭问答',
          '详细说明|details': 'TBD当前群关闭智能问答',
          '类型|type': '群指令',
          '说明|desc': 'TBD当前群关闭智能问答',
        },
      },
      {
        recordId: 'recOjLt6bo607',
        createdAt: 1702519536000,
        updatedAt: 1702522214000,
        fields: {
          '指令名称|name': '车找人',
          '详细说明|details': '筛选车找人信息',
          '类型|type': '等于关键字',
          '说明|desc': '筛选车找人信息',
        },
      },
      {
        recordId: 'recgUzfvvXezX',
        createdAt: 1702519536000,
        updatedAt: 1702522214000,
        fields: {
          '指令名称|name': '人找车',
          '详细说明|details': '匹配人找车信息',
          '类型|type': '包含关键字',
          '说明|desc': '匹配人找车信息',
        },
      },
    ],
    pageNum: 1,
    pageSize: 15,
  },
  message: 'SUCCESS',
};
export const keywordSheet: Sheet = {
  fields: vikaFields.data.fields,
  name: '关键词|Keyword',
  defaultRecords: defaultRecords.data.records,
};
