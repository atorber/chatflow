/* eslint-disable sort-keys */

import type {
  Sheet,
  Field,
} from './Model'

const recordRes = {
  code: 200,
  success: true,
  data: {
    total: 10,
    records: [
      {
        recordId: 'recf6KOk48YKn',
        createdAt: 1671302940000,
        updatedAt: 1671303805000,
        fields: {
          说明: '开启后可以使用微信对话平台只能问答',
          功能项: '智能问答',
          标识: 'WX_OPENAI_ONOFF',
          '启用状态（只修改此列）': '关闭',
          配置组: '智能问答',
        },
      },
      {
        recordId: 'recYniqLy8b8D',
        createdAt: 1671302940000,
        updatedAt: 1671303814000,
        fields: {
          说明: '开启后只有@机器人时才会回复问答',
          功能项: 'AT回复',
          标识: 'AT_AHEAD',
          '启用状态（只修改此列）': '开启',
          配置组: '智能问答',
        },
      },
      {
        recordId: 'recn53pOPa3Fu',
        createdAt: 1671302940000,
        updatedAt: 1671303822000,
        fields: {
          说明: '开启后不同群相同问题可以设置不同的回答',
          功能项: '不同群个性回复',
          标识: 'DIFF_REPLY_ONOFF',
          '启用状态（只修改此列）': '开启',
          配置组: '智能问答',
        },
      },
      {
        recordId: 'recPdt5BOLiXq',
        createdAt: 1671302940000,
        updatedAt: 1671303837000,
        fields: {
          说明: '开启后只对白名单内的群消息进行自动问答',
          功能项: '群白名单',
          标识: 'roomWhiteListOpen',
          '启用状态（只修改此列）': '开启',
          配置组: '智能问答',
        },
      },
      {
        recordId: 'recHv8B2IaofP',
        createdAt: 1671302940000,
        updatedAt: 1671303853000,
        fields: {
          说明: '开启后只对白名单内的好友消息进行自动问答',
          功能项: '好友白名单',
          标识: 'contactWhiteListOpen',
          '启用状态（只修改此列）': '开启',
          配置组: '智能问答',
        },
      },
      {
        recordId: 'recXEwHZSAATR',
        createdAt: 1671302940000,
        updatedAt: 1671303860000,
        fields: {
          说明: '开启后消息记录会自动上传到维格表的【消息记录】表',
          功能项: '消息上传到维格表',
          标识: 'VIKA_ONOFF',
          '启用状态（只修改此列）': '开启',
          配置组: '消息推送',
        },
      },
      {
        recordId: 'rec1WdnWXsyPo',
        createdAt: 1671302940000,
        updatedAt: 1671303946000,
        fields: {
          说明: 'TODO-开启后系统将机器人事件消息推送到指定的地址',
          功能项: 'WebHook推送',
          标识: 'WEB_HOOK_ONOFF',
          '启用状态（只修改此列）': '关闭',
          配置组: '消息推送',
        },
      },
      {
        recordId: 'recjMAPK1OZbT',
        createdAt: 1671302940000,
        updatedAt: 1671303880000,
        fields: {
          说明: '开启后消息会发送到MQTT队列，需要先配置MQTT配置项',
          功能项: 'MQTT推送',
          标识: 'mqtt_PUB_ONOFF',
          '启用状态（只修改此列）': '关闭',
          配置组: '消息推送',
        },
      },
      {
        recordId: 'recESlHvyEPcj',
        createdAt: 1671302940000,
        updatedAt: 1671303873000,
        fields: {
          说明: '开启可以通过MQTT控制微信，需要先配置MQTT配置项',
          功能项: 'MQTT控制',
          标识: 'mqtt_SUB_ONOFF',
          '启用状态（只修改此列）': '关闭',
          配置组: '远程控制',
        },
      },
      {
        recordId: 'recumi1YTrUAq',
        createdAt: 1671302940000,
        updatedAt: 1671303906000,
        fields: {
          说明: '开启后可以使用客服对话系统，需先手动启用IM服务',
          功能项: 'IM对话',
          标识: 'imOpen',
          '启用状态（只修改此列）': '关闭',
          配置组: '客服系统',
        },
      },
    ],
    pageNum: 1,
    pageSize: 10,
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
        id: 'fldq84eKS9Cyq',
        name: '配置组',
        type: 'SingleText',
        property: {
          defaultValue: '',
        },
        editable: true,
        isPrimary: true,
      },
      {
        id: 'fldPp0bwSk84x',
        name: '功能项',
        type: 'SingleText',
        property: {},
        editable: true,
      },
      {
        id: 'fldZ0kmh0WQTh',
        name: '标识',
        type: 'SingleText',
        property: {},
        editable: true,
      },
      {
        id: 'fldmndbxeLd37',
        name: '启用状态（只修改此列）',
        type: 'SingleSelect',
        property: {
          options: [
            {
              id: 'opt4DXQURFJQf',
              name: '开启',
              color: {
                name: 'deepPurple_0',
                value: '#E5E1FC',
              },
            },
            {
              id: 'optvpgML9rza6',
              name: '关闭',
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
        id: 'fldAKw21lBTlb',
        name: '说明',
        type: 'Text',
        editable: true,
      },
    ],
  },
  message: 'SUCCESS',
}

const fields: Field[] = vikaRes.data.fields

const switchSheet: Sheet = {
  fields,
  name: '功能开关',
  defaultRecords,
}

export {
  switchSheet,
}

export default switchSheet
