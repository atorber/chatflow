/* eslint-disable sort-keys */

import type {
  Sheet,
  Field,
} from './Model'

const recordRes = {
  code: 200,
  success: true,
  data: {
    total: 12,
    records: [
      {
        recordId: 'recdZM91Tu8Vq',
        createdAt: 1671304486000,
        updatedAt: 1683341245000,
        fields: {
          启用状态: '关闭',
          配置组标识: 'autoQa',
          功能项: '启用自动问答',
          配置组: '智能问答',
          标识: 'autoReply',
          说明: '开启后可以使用微信对话平台只能问答',
        },
      },
      {
        recordId: 'recILZpkkckpi',
        createdAt: 1671304486000,
        updatedAt: 1683303494000,
        fields: {
          启用状态: '开启',
          配置组标识: 'autoQa',
          功能项: 'AT回复',
          配置组: '智能问答',
          标识: 'atReply',
          说明: '开启后只有@机器人时才会回复问答',
        },
      },
      {
        recordId: 'recKRx4x1ajE8',
        createdAt: 1671304486000,
        updatedAt: 1683303494000,
        fields: {
          启用状态: '关闭',
          配置组标识: 'autoQa',
          功能项: '不同群个性回复',
          配置组: '智能问答',
          标识: 'customReply',
          说明: '开启后不同群相同问题可以设置不同的回答',
        },
      },
      {
        recordId: 'recClukJEugD8',
        createdAt: 1671304486000,
        updatedAt: 1683303494000,
        fields: {
          启用状态: '开启',
          配置组标识: 'autoQa',
          功能项: '群白名单',
          配置组: '智能问答',
          标识: 'roomWhitelist',
          说明: '开启后只对白名单内的群消息进行自动问答',
        },
      },
      {
        recordId: 'recFni0OMgcXR',
        createdAt: 1671304486000,
        updatedAt: 1683303494000,
        fields: {
          启用状态: '开启',
          配置组标识: 'autoQa',
          功能项: '好友白名单',
          配置组: '智能问答',
          标识: 'contactWhitelist',
          说明: '开启后只对白名单内的好友消息进行自动问答',
        },
      },
      {
        recordId: 'reclZvMhMbrLA',
        createdAt: 1683341186000,
        updatedAt: 1683341252000,
        fields: {
          启用状态: '开启',
          配置组标识: 'vika',
          功能项: '启用维格表',
          配置组: '维格表',
          标识: 'useVika',
        },
      },
      {
        recordId: 'reccta6czN536',
        createdAt: 1671304486000,
        updatedAt: 1683303809000,
        fields: {
          启用状态: '开启',
          配置组标识: 'vika',
          功能项: '消息上传到维格表',
          配置组: '维格表',
          标识: 'uploadMessageToVika',
          说明: '开启后消息记录会自动上传到维格表的【消息记录】表',
        },
      },
      {
        recordId: 'rec7QjKnBKpIY',
        createdAt: 1683303823000,
        updatedAt: 1683303850000,
        fields: {
          启用状态: '关闭',
          配置组标识: 'vika',
          功能项: '配置云同步',
          配置组: '维格表',
          标识: 'autoMaticCloud',
        },
      },
      {
        recordId: 'rec0hgqiA6Cc7',
        createdAt: 1671304486000,
        updatedAt: 1683303514000,
        fields: {
          启用状态: '关闭',
          配置组标识: 'webHook',
          功能项: 'WebHook推送',
          配置组: 'HTTP消息推送',
          标识: 'webhookMessagePush',
          说明: 'TODO-开启后系统将机器人事件消息推送到指定的地址',
        },
      },
      {
        recordId: 'recchnZdbQK2S',
        createdAt: 1671304486000,
        updatedAt: 1683303518000,
        fields: {
          启用状态: '关闭',
          配置组标识: 'mqtt',
          功能项: 'MQTT推送',
          配置组: 'MQTT连接',
          标识: 'mqttMessagePush',
          说明: '开启后消息会发送到MQTT队列，需要先配置MQTT配置项',
        },
      },
      {
        recordId: 'reciwvE8H9CPf',
        createdAt: 1671304486000,
        updatedAt: 1683303522000,
        fields: {
          启用状态: '关闭',
          配置组标识: 'mqtt',
          功能项: 'MQTT控制',
          配置组: 'MQTT连接',
          标识: 'mqttControl',
          说明: '开启可以通过MQTT控制微信，需要先配置MQTT配置项',
        },
      },
      {
        recordId: 'recaYaXkyTVJA',
        createdAt: 1671304486000,
        updatedAt: 1683303530000,
        fields: {
          启用状态: '关闭',
          配置组标识: 'im',
          功能项: 'IM对话',
          配置组: '客服系统',
          标识: 'imChat',
          说明: '开启后可以使用客服对话系统，需先手动启用IM服务',
        },
      },
    ],
    pageNum: 1,
    pageSize: 12,
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
        id: 'fldGxoFMPKIPt',
        name: '配置组',
        type: 'SingleText',
        property: {
          defaultValue: '',
        },
        editable: true,
        isPrimary: true,
      },
      {
        id: 'fld8CKSjgwcPs',
        name: '配置组标识',
        type: 'SingleText',
        property: {},
        editable: true,
      },
      {
        id: 'fldC7hfa7e1Xw',
        name: '功能项',
        type: 'SingleText',
        property: {},
        editable: true,
      },
      {
        id: 'fldSosuw4xlXB',
        name: '标识',
        type: 'SingleText',
        property: {},
        editable: true,
      },
      {
        id: 'fld3qG3X0ZlFs',
        name: '启用状态',
        type: 'SingleSelect',
        property: {
          options: [
            {
              id: 'optWMNg5xJJZS',
              name: '开启',
              color: {
                name: 'deepPurple_0',
                value: '#E5E1FC',
              },
            },
            {
              id: 'optNtIR7ecTja',
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
        id: 'fldogMQE99uDi',
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
