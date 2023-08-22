/* eslint-disable sort-keys */

import type {
  Sheet,
  Field,
} from './Model'

const recordRes = {
  code: 200,
  success: true,
  data: {
    total: 19,
    records: [
      {
        recordId: 'recPBl9ASIJR7',
        createdAt: 1683302503000,
        updatedAt: 1683362189000,
        fields: {
          配置项: '管理群-管理群ID',
          标识: 'ADMINROOM_ADMINROOMID',
          说明: '管理群的ID，只有在此群内发布管理指令才会生效',
        },
      },
      {
        recordId: 'rec5A51Aa2xhX',
        createdAt: 1683302744000,
        updatedAt: 1683362199000,
        fields: {
          配置项: '管理群-管理群名称',
          标识: 'ADMINROOM_ADMINROOMTOPIC',
          说明: '管理群名称，只有在此群内发布管理指令才会生效',
        },
      },
      {
        recordId: 'recrEIHXFV14w',
        createdAt: 1671304478000,
        updatedAt: 1683354854000,
        fields: {
          配置项: 'Wechaty-WechatyPuppet',
          标识: 'WECHATY_PUPPET',
          说明: '可选值：\nwechaty-puppet-wechat4u\nwechaty-puppet-wechat\nwechaty-puppet-xp\nwechaty-puppet-engine\u0000\nwechaty-puppet-padlocal\nwechaty-puppet-service',
          值: 'wechaty-puppet-wechat4u',
        },
      },
      {
        recordId: 'rec99fo7LJIXP',
        createdAt: 1671304478000,
        updatedAt: 1683354845000,
        fields: {
          配置项: 'Wechaty-WechatyToken',
          标识: 'WECHATY_TOKEN',
          说明: '使用wechaty-puppet-padlocal、wechaty-puppet-service时需配置此token',
        },
      },
      {
        recordId: 'recinVcKkDT4g',
        createdAt: 1671304478000,
        updatedAt: 1683362233000,
        fields: {
          配置项: '智能问答类型-平台类型',
          标识: 'AUTOQA_TYPE',
          说明: '可选值：\nwxOpenAi\nchatGpt',
          值: 'wxOpenAi',
        },
      },
      {
        recordId: 'reca02j4zeJJO',
        createdAt: 1671304478000,
        updatedAt: 1683302805000,
        fields: {
          配置项: '微信对话开放平台-Token',
          标识: 'WXOPENAI_TOKEN',
          说明: '微信对话开放平台中获取',
        },
      },
      {
        recordId: 'recDs5CswG6Y2',
        createdAt: 1671304478000,
        updatedAt: 1683302809000,
        fields: {
          配置项: '微信对话开放平台-EncodingAESKey',
          标识: 'WXOPENAI_ENCODINGAESKEY',
          说明: '微信对话开放平台中获取',
        },
      },
      {
        recordId: 'recC1fHb229aw',
        createdAt: 1683351452000,
        updatedAt: 1683362266000,
        fields: {
          配置项: 'ChatGPT-Key',
          标识: 'CHATGPT_KEY',
          说明: 'openai平台获取或使用api2d',
        },
      },
      {
        recordId: 'recInnEvRdBtB',
        createdAt: 1683351450000,
        updatedAt: 1683362267000,
        fields: {
          配置项: 'ChatGPT-Endpoint',
          标识: 'CHATGPT_ENDPOINT',
          说明: 'openai平台获取或使用api2d',
        },
      },
      {
        recordId: 'recos1u8VvHuQ',
        createdAt: 1671304478000,
        updatedAt: 1683302909000,
        fields: {
          配置项: 'MQTT连接-用户名',
          标识: 'MQTT_USERNAME',
          说明: 'MQTT连接配置信息，推荐使用百度云的物联网核心套件',
        },
      },
      {
        recordId: 'rechxZI6WS5Uq',
        createdAt: 1671304478000,
        updatedAt: 1683302912000,
        fields: {
          配置项: 'MQTT连接-密码',
          标识: 'MQTT_PASSWORD',
          说明: 'MQTT连接配置信息，推荐使用百度云的物联网核心套件',
        },
      },
      {
        recordId: 'recB2MNTLz9zM',
        createdAt: 1671304480000,
        updatedAt: 1683302918000,
        fields: {
          配置项: 'MQTT连接-接入地址',
          标识: 'MQTT_ENDPOINT',
          说明: 'MQTT连接配置信息，推荐使用百度云的物联网核心套件',
        },
      },
      {
        recordId: 'recqXfHERfj3b',
        createdAt: 1671304480000,
        updatedAt: 1683362365000,
        fields: {
          配置项: 'MQTT连接-端口号',
          标识: 'MQTT_PORT',
          说明: 'MQTT连接配置信息，推荐使用百度云的物联网核心套件',
          值: '1883',
        },
      },
      {
        recordId: 'rec8prGUMpMiw',
        createdAt: 1671304480000,
        updatedAt: 1683362373000,
        fields: {
          配置项: 'HTTP消息推送-地址',
          标识: 'WEBHOOK_URL',
          说明: '格式 http://baidu.com/abc,多个地址使用英文逗号隔开，使用post请求推送',
        },
      },
      {
        recordId: 'rec5qrdq7KQDD',
        createdAt: 1683362377000,
        updatedAt: 1683362490000,
        fields: {
          配置项: 'HTTP消息推送-Token',
          标识: 'WEBHOOK_TOKEN',
          说明: '当填写token时优先使用token，其次用户名+密码，再次无鉴权请求',
        },
      },
      {
        recordId: 'recQrTGCt5HoY',
        createdAt: 1683362393000,
        updatedAt: 1683362494000,
        fields: {
          配置项: 'HTTP消息推送-用户名',
          标识: 'WEBHOOK_USERNAME',
          说明: '当填写token时优先使用token，其次用户名+密码，再次无鉴权请求',
        },
      },
      {
        recordId: 'recJZm5Ip0ycw',
        createdAt: 1683362395000,
        updatedAt: 1683362496000,
        fields: {
          配置项: 'HTTP消息推送-密码',
          标识: 'WEBHOOK_PASSWORD',
          说明: '当填写token时优先使用token，其次用户名+密码，再次无鉴权请求',
        },
      },
      {
        recordId: 'recXerzWBcbcX',
        createdAt: 1683302493000,
        updatedAt: 1683362296000,
        fields: {
          配置项: '语雀-token',
          标识: 'YUQUE_TOKEN',
          说明: '语雀知识库token',
        },
      },
      {
        recordId: 'recqyaulVdpTr',
        createdAt: 1683302493000,
        updatedAt: 1683362308000,
        fields: {
          配置项: '语雀-空间名称',
          标识: 'YUQUE_NAMESPACE',
          说明: '语雀知识库空间名称',
        },
      },
      {
        recordId: 'recdZM91Tu8Vq',
        createdAt: 1671304486000,
        updatedAt: 1683341245000,
        fields: {
          配置项: '智能问答-启用自动问答',
          标识: 'AUTOQA_AUTOREPLY',
          值: '关闭',
          说明: '开启后可以使用微信对话平台只能问答',
        },
      },
      {
        recordId: 'recILZpkkckpi',
        createdAt: 1671304486000,
        updatedAt: 1683303494000,
        fields: {
          值: '开启',
          配置项: '智能问答-@回复',
          标识: 'AUTOQA_ATREPLY',
          说明: '开启后只有@机器人时才会回复问答',
        },
      },
      {
        recordId: 'recKRx4x1ajE8',
        createdAt: 1671304486000,
        updatedAt: 1683303494000,
        fields: {
          值: '关闭',
          配置项: '智能问答-不同群个性回复',
          标识: 'AUTOQA_CUSTOMREPLY',
          说明: '开启后不同群相同问题可以设置不同的回答',
        },
      },
      {
        recordId: 'recClukJEugD8',
        createdAt: 1671304486000,
        updatedAt: 1683303494000,
        fields: {
          值: '开启',
          配置项: '群智能问答-群白名单白名单',
          标识: 'AUTOQA_ROOMWHITELIST',
          说明: '开启后只对白名单内的群消息进行自动问答',
        },
      },
      {
        recordId: 'recFni0OMgcXR',
        createdAt: 1671304486000,
        updatedAt: 1683303494000,
        fields: {
          值: '开启',
          配置项: '智能问答-好友白名单',
          标识: 'AUTOQA_CONTACTWHITELIST',
          说明: '开启后只对白名单内的好友消息进行自动问答',
        },
      },
      {
        recordId: 'reclZvMhMbrLA',
        createdAt: 1683341186000,
        updatedAt: 1683341252000,
        fields: {
          值: '开启',
          配置项: '维格表-启用维格表',
          标识: 'VIKA_USEVIKA',
        },
      },
      {
        recordId: 'reccta6czN536',
        createdAt: 1671304486000,
        updatedAt: 1683303809000,
        fields: {
          值: '开启',
          配置项: '维格表-消息上传到维格表',
          标识: 'VIKA_UPLOADMESSAGETOVIKA',
          说明: '开启后消息记录会自动上传到维格表的【消息记录】表',
        },
      },
      {
        recordId: 'rec7QjKnBKpIY',
        createdAt: 1683303823000,
        updatedAt: 1683303850000,
        fields: {
          值: '关闭',
          配置项: '维格表-配置云同步',
          标识: 'VIKA_AUTOMATICCLOUD',
        },
      },
      {
        recordId: 'rec0hgqiA6Cc7',
        createdAt: 1671304486000,
        updatedAt: 1683303514000,
        fields: {
          值: '关闭',
          配置项: 'HTTP消息推送-WebHook推送',
          标识: 'WEBHOOK_WEBHOOKMESSAGEPUSH',
          说明: 'TODO-开启后系统将机器人事件消息推送到指定的地址',
        },
      },
      {
        recordId: 'recchnZdbQK2S',
        createdAt: 1671304486000,
        updatedAt: 1683303518000,
        fields: {
          值: '关闭',
          配置项: 'MQTT连接-MQTT推送',
          标识: 'MQTT_MQTTMESSAGEPUSH',
          说明: '开启后消息会发送到MQTT队列，需要先配置MQTT配置项',
        },
      },
      {
        recordId: 'reciwvE8H9CPf',
        createdAt: 1671304486000,
        updatedAt: 1683303522000,
        fields: {
          值: '关闭',
          配置项: 'MQTT连接-MQTT控制',
          标识: 'MQTT_MQTTCONTROL',
          说明: '开启可以通过MQTT控制微信，需要先配置MQTT配置项',
        },
      },
      {
        recordId: 'recaYaXkyTVJA',
        createdAt: 1671304486000,
        updatedAt: 1683303530000,
        fields: {
          值: '关闭',
          配置项: '客服系统-IM对话',
          标识: 'IM_IMCHAT',
          说明: '开启后可以使用客服对话系统，需先手动启用IM服务',
        },
      },
    ],
    pageNum: 1,
    pageSize: 19,
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
        id: 'fldHweXlPkEre',
        name: '配置项',
        type: 'SingleText',
        property: {},
        editable: true,
        isPrimary: true,
      },
      {
        id: 'fldRvvud37nrh',
        name: '标识',
        type: 'SingleText',
        property: {},
        editable: true,
      },
      {
        id: 'fldzgaXqumNkW',
        name: '值',
        type: 'Text',
        editable: true,
      },
      {
        id: 'fldx2StDC2LGw',
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
