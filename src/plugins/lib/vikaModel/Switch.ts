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
          功能项: '智能问答-启用自动问答',
          标识: 'AUTOQA_AUTOREPLY',
          说明: '开启后可以使用微信对话平台只能问答',
        },
      },
      {
        recordId: 'recILZpkkckpi',
        createdAt: 1671304486000,
        updatedAt: 1683303494000,
        fields: {
          启用状态: '开启',
          功能项: '智能问答-@回复',
          标识: 'AUTOQA_ATREPLY',
          说明: '开启后只有@机器人时才会回复问答',
        },
      },
      {
        recordId: 'recKRx4x1ajE8',
        createdAt: 1671304486000,
        updatedAt: 1683303494000,
        fields: {
          启用状态: '关闭',
          功能项: '智能问答-不同群个性回复',
          标识: 'AUTOQA_CUSTOMREPLY',
          说明: '开启后不同群相同问题可以设置不同的回答',
        },
      },
      {
        recordId: 'recClukJEugD8',
        createdAt: 1671304486000,
        updatedAt: 1683303494000,
        fields: {
          启用状态: '开启',
          功能项: '群智能问答-群白名单白名单',
          标识: 'AUTOQA_ROOMWHITELIST',
          说明: '开启后只对白名单内的群消息进行自动问答',
        },
      },
      {
        recordId: 'recFni0OMgcXR',
        createdAt: 1671304486000,
        updatedAt: 1683303494000,
        fields: {
          启用状态: '开启',
          功能项: '智能问答-好友白名单',
          标识: 'AUTOQA_CONTACTWHITELIST',
          说明: '开启后只对白名单内的好友消息进行自动问答',
        },
      },
      {
        recordId: 'reclZvMhMbrLA',
        createdAt: 1683341186000,
        updatedAt: 1683341252000,
        fields: {
          启用状态: '开启',
          功能项: '维格表-启用维格表',
          标识: 'VIKA_USEVIKA',
        },
      },
      {
        recordId: 'reccta6czN536',
        createdAt: 1671304486000,
        updatedAt: 1683303809000,
        fields: {
          启用状态: '开启',
          功能项: '维格表-消息上传到维格表',
          标识: 'VIKA_UPLOADMESSAGETOVIKA',
          说明: '开启后消息记录会自动上传到维格表的【消息记录】表',
        },
      },
      {
        recordId: 'rec7QjKnBKpIY',
        createdAt: 1683303823000,
        updatedAt: 1683303850000,
        fields: {
          启用状态: '关闭',
          功能项: '维格表-配置云同步',
          标识: 'VIKA_AUTOMATICCLOUD',
        },
      },
      {
        recordId: 'rec0hgqiA6Cc7',
        createdAt: 1671304486000,
        updatedAt: 1683303514000,
        fields: {
          启用状态: '关闭',
          功能项: 'HTTP消息推送-WebHook推送',
          标识: 'WEBHOOK_WEBHOOKMESSAGEPUSH',
          说明: 'TODO-开启后系统将机器人事件消息推送到指定的地址',
        },
      },
      {
        recordId: 'recchnZdbQK2S',
        createdAt: 1671304486000,
        updatedAt: 1683303518000,
        fields: {
          启用状态: '关闭',
          功能项: 'MQTT连接-MQTT推送',
          标识: 'MQTT_MQTTMESSAGEPUSH',
          说明: '开启后消息会发送到MQTT队列，需要先配置MQTT配置项',
        },
      },
      {
        recordId: 'reciwvE8H9CPf',
        createdAt: 1671304486000,
        updatedAt: 1683303522000,
        fields: {
          启用状态: '关闭',
          功能项: 'MQTT连接-MQTT控制',
          标识: 'MQTT_MQTTCONTROL',
          说明: '开启可以通过MQTT控制微信，需要先配置MQTT配置项',
        },
      },
      {
        recordId: 'recaYaXkyTVJA',
        createdAt: 1671304486000,
        updatedAt: 1683303530000,
        fields: {
          启用状态: '关闭',
          功能项: '客服系统-IM对话',
          标识: 'IM_IMCHAT',
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
        id: 'fldC7hfa7e1Xw',
        name: '功能项',
        type: 'SingleText',
        property: {},
        editable: true,
        isPrimary: true,
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
