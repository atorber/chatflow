/* eslint-disable sort-keys */

import type {
  Sheet,
  Field,
} from './Model'

const recordRes = {
  code: 200,
  success: true,
  data: {
    total: 13,
    records: [
      {
        recordId: 'recm3YUoiY3lX',
        fields: {
          配置组: '基本配置',
          配置组标识: 'base',
          配置项: '管理群',
          标识: 'adminRoomTopic',
          '值（只修改此列）': '大师是群主',
          说明: '管理群名称，需尽量保持名称复杂，避免重名群干扰',
        },
      },
      {
        recordId: 'recrEIHXFV14w',
        createdAt: 1671304478000,
        updatedAt: 1671308763000,
        fields: {
          配置项: 'WechatyPuppet',
          标识: 'puppetName',
          配置组: 'Wechaty',
          配置组标识: 'wechaty',
          说明: '可选值：\nwechaty-puppet-wechat4u\nwechaty-puppet-wechat\nwechaty-puppet-xp\nwechaty-puppet-padlocal\nwechaty-puppet-service',
          '值（只修改此列）': 'wechaty-puppet-wechat4u',
        },
      },
      {
        recordId: 'rec99fo7LJIXP',
        createdAt: 1671304478000,
        updatedAt: 1671308940000,
        fields: {
          配置项: 'WechatyToken',
          标识: 'puppetToken',
          配置组: 'Wechaty',
          配置组标识: 'wechaty',
          说明: '使用wechaty-puppet-padlocal、wechaty-puppet-service时需配置此token',
        },
      },
      {
        recordId: 'recinVcKkDT4g',
        createdAt: 1671304478000,
        updatedAt: 1671306617000,
        fields: {
          配置项: 'AI对话平台Type',
          标识: 'aiType',
          配置组: '自动问答',
          配置组标识: 'auto-qa',
          说明: 'TODO-可选值：\nWxOpenai\nChatGPT',
          '值（只修改此列）': 'WxOpenai',
        },
      },
      {
        recordId: 'reca02j4zeJJO',
        createdAt: 1671304478000,
        updatedAt: 1671304478000,
        fields: {
          配置项: '微信对话开放平台Token',
          标识: 'WX_TOKEN',
          配置组: '微信开放对话平台',
          配置组标识: 'wx-open-ai',
          说明: '微信对话开放平台中获取',
        },
      },
      {
        recordId: 'recDs5CswG6Y2',
        createdAt: 1671304478000,
        updatedAt: 1671304478000,
        fields: {
          配置项: '微信对话开放平台EncodingAESKey',
          标识: 'EncodingAESKey',
          配置组: '智能问答',
          说明: '微信对话开放平台中获取',
        },
      },
      {
        recordId: 'rec5Mjc4E6GjK',
        createdAt: 1671304478000,
        updatedAt: 1671304478000,
        fields: {
          配置项: 'ChatGPTAEmail',
          标识: 'ChatGPTAEmail',
          配置组: '智能问答',
          说明: 'TODO',
        },
      },
      {
        recordId: 'recN4gbSUoWIa',
        createdAt: 1671304478000,
        updatedAt: 1671304478000,
        fields: {
          配置项: 'ChatGPTAPassword',
          标识: 'ChatGPTAPassword',
          配置组: '智能问答',
          说明: 'TODO',
        },
      },
      {
        recordId: 'rechhkGPqXzo6',
        createdAt: 1671304478000,
        updatedAt: 1671304478000,
        fields: {
          配置项: 'ChatGPTASessionToken',
          标识: 'ChatGPTASessionToken',
          配置组: '智能问答',
          说明: 'TODO',
        },
      },
      {
        recordId: 'recos1u8VvHuQ',
        createdAt: 1671304478000,
        updatedAt: 1671304478000,
        fields: {
          配置项: 'MQTT用户名',
          标识: 'mqttUsername',
          配置组: 'MQTT连接',
          说明: 'MQTT连接配置信息，推荐使用百度云的物联网核心套件',
        },
      },
      {
        recordId: 'rechxZI6WS5Uq',
        createdAt: 1671304478000,
        updatedAt: 1671304478000,
        fields: {
          配置项: 'MQTT密码',
          标识: 'mqttPassword',
          配置组: 'MQTT连接',
          说明: 'MQTT连接配置信息，推荐使用百度云的物联网核心套件',
        },
      },
      {
        recordId: 'recB2MNTLz9zM',
        createdAt: 1671304480000,
        updatedAt: 1671304480000,
        fields: {
          配置项: 'MQTT接入地址',
          标识: 'mqttEndpoint',
          配置组: 'MQTT连接',
          说明: 'MQTT连接配置信息，推荐使用百度云的物联网核心套件',
        },
      },
      {
        recordId: 'recqXfHERfj3b',
        createdAt: 1671304480000,
        updatedAt: 1671304480000,
        fields: {
          配置项: 'MQTT端口号',
          标识: 'mqttPort',
          配置组: 'MQTT连接',
          说明: 'MQTT连接配置信息，推荐使用百度云的物联网核心套件',
          '值（只修改此列）': '1883',
        },
      },
      {
        recordId: 'rec8prGUMpMiw',
        createdAt: 1671304480000,
        updatedAt: 1671304480000,
        fields: {
          配置项: 'WebHook地址',
          标识: 'WEB_HOOK',
          配置组: '消息推送',
          说明: 'TODO-格式 http://baidu.com/abc,多个地址使用英文逗号隔开，使用post请求推送',
        },
      },
    ],
    pageNum: 1,
    pageSize: 13,
  },
  message: 'SUCCESS',
}

const defaultRecords: any[] = recordRes.data.records

const vikaRes = {
  code: 200,
  success: true,
  data: {
    fields: [
      {
        id: 'fldswxMTbHJwr',
        name: '配置组',
        type: 'SingleText',
        property: {},
        editable: true,
        isPrimary: true,
      },
      {
        id: 'fldswxMTbHJwr',
        name: '配置组标识',
        type: 'SingleText',
        property: {},
        editable: true,
        isPrimary: true,
      },
      {
        id: 'fldlCUQ2Aju1Y',
        name: '配置项',
        type: 'SingleText',
        property: {},
        editable: true,
      },
      {
        id: 'fldDrMTuWCuCM',
        name: '标识',
        type: 'SingleText',
        property: {},
        editable: true,
      },
      {
        id: 'fld6GYkhQCQ7m',
        name: '值（只修改此列）',
        type: 'Text',
        editable: true,
      },
      {
        id: 'fldpD6BA5xeZf',
        name: '说明',
        type: 'Text',
        editable: true,
      },
    ],
  },
  message: 'SUCCESS',
}

const fields: Field[] = vikaRes.data.fields

const configSheet: Sheet = {
  fields,
  name: '环境变量',
  defaultRecords,
}

export {
  configSheet,
}

export default configSheet
