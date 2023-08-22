/* eslint-disable sort-keys */
enum FieldType {
    SingleText = 'SingleText',
    SingleSelect = 'SingleSelect',
    Text = 'Text',
    Attachment = 'Attachment'
}

export type Field = {
    name: string,
    type: string,
    property?: any,
    desc?: string
};

export type FieldSingleText = Field & { type: FieldType.SingleText };
export type FieldSingleSelect = Field & { type: FieldType.SingleSelect };
export type FieldText = Field & { type: FieldType.Text };

export type Record = {
    fields: {
        [key: string]: string
    }
}

export type Sheet = {
    fields: Field[],
    name: string,
    defaultRecords: Record[]
}

// export type CommandSchema = {
//     '指令名称': FieldSingleText,
//     '说明': FieldText,
//     '管理员微信号': FieldSingleText,
//     '类型': FieldSingleSelect,
// };

// export type Command = Sheet & {
//     fields: CommandSchema,
//     name: '指令列表',
//     defaultRecords: Record[]
// }

const commandSheet: Sheet = {
  fields: [ {
    name: '指令名称',
    type: FieldType.SingleText,
    property: {
      defaultValue: '',
    },
  },
  {
    name: '说明',
    type: FieldType.Text,
  },
  // {
  //   name: '管理员微信号',
  //   type: FieldType.SingleText,
  //   property: {

  //   },
  // },
  {
    name: '类型',
    type: FieldType.SingleSelect,
    property: {
      options: [
        {
          name: '系统指令',
          color: 'deepPurple_0',
        },
        {
          name: '群指令',
          color: 'indigo_0',
        },
      ],
      defaultValue: '系统指令',
    },
  },
  ],
  name: '指令列表',
  defaultRecords: [
    {
      fields: {
        指令名称: '更新配置',
        说明: '更新系统配置，更改配置后需主动更新一次配置配置才会生效',
        类型: '系统指令',
      },
    },
    {
      fields: {
        指令名称: '更新白名单',
        说明: '更新群白名单，白名单变动时需主动更新白名单',
        类型: '系统指令',
      },
    },
    {
      fields: {
        指令名称: '更新问答',
        说明: '更新微信对话平台中的问答列表',
        类型: '系统指令',
      },
    },
    {
      fields: {
        指令名称: '更新机器人',
        说明: '更新机器人的群列表和好友列表',
        类型: '系统指令',
      },
    },
    {
      fields: {
        指令名称: '启用问答',
        说明: '当前群启用智能问答',
        类型: '群指令',
      },
    },
    {
      fields: {
        指令名称: '关闭问答',
        说明: '当前群关闭智能问答',
        类型: '群指令',
      },
    },
  ],
}

// export type ConfigSchema = {
//     '机器人名称': FieldSingleText,
//     'AT回复': FieldSingleSelect,
//     '智能问答': FieldSingleSelect,
//     '对话平台token': FieldSingleText,
// };

// export type Config = Sheet & {
//     fields: ConfigSchema,
//     name: '系统配置',
//     defaultRecords: Record[]
// }

const configSheet: Sheet = {
  fields: [
    {
      name: '机器人名称',
      type: 'SingleText',
      property: {
        defaultValue: '',
      },
    },
    {
      name: 'AT回复',
      type: 'SingleSelect',
      property: {
        options: [
          {
            name: '开启',
            color: 'deepPurple_0',
          },
          {
            name: '关闭',
            color: 'indigo_0',
          },
        ],
        defaultValue: '关闭',
      },
    },
    {
      name: '智能问答',
      type: 'SingleSelect',
      property: {
        options: [
          {
            name: '开启',
            color: 'deepPurple_0',
          },
          {
            name: '关闭',
            color: 'indigo_0',
          },
        ],
        defaultValue: '关闭',
      },
      desc: '开启后可以使用微信对话平台只能问答',
    },
    {
      name: '对话平台token',
      type: 'SingleText',
      property: {
        defaultValue: '',
      },
      desc: '微信开放对话平台token，启用智能问答时必须填写，否则无效',
    },
    {
      name: '对话平台EncodingAESKey',
      type: 'SingleText',
      property: {
        defaultValue: '',
      },
      desc: '微信开放对话平台EncodingAESKey，启用智能问答时必须填写，否则无效',
    },
    {
      name: '不同群个性回复',
      type: 'SingleSelect',
      property: {
        options: [
          {
            name: '开启',
            color: 'deepPurple_0',
          },
          {
            name: '关闭',
            color: 'indigo_0',
          },
        ],
        defaultValue: '开启',
      },
      desc: '开启后不同群相同问题可以得到不同答案',
    },
    {
      name: '群白名单',
      type: 'SingleSelect',
      property: {
        options: [
          {
            name: '开启',
            color: 'deepPurple_0',
          },
          {
            name: '关闭',
            color: 'indigo_0',
          },
        ],
        defaultValue: '开启',
      },
      desc: '开启后只有白名单内的群会自动问答',
    },
    {
      name: '好友白名单',
      type: 'SingleSelect',
      property: {
        options: [
          {
            name: '开启',
            color: 'deepPurple_0',
          },
          {
            name: '关闭',
            color: 'indigo_0',
          },
        ],
        defaultValue: '开启',
      },
      desc: '开启后只有白名单内的好友自动问答',
    },
    {
      name: '消息上传到维格表',
      type: 'SingleSelect',
      property: {
        options: [
          {
            name: '开启',
            color: 'deepPurple_0',
          },
          {
            name: '关闭',
            color: 'indigo_0',
          },
        ],
        defaultValue: '开启',
      },
      desc: '开启后消息记录会自动上传到维格表的【消息记录】表中',
    },
    {
      name: 'IM对话',
      type: 'SingleSelect',
      property: {
        options: [
          {
            name: '开启',
            color: 'deepPurple_0',
          },
          {
            name: '关闭',
            color: 'indigo_0',
          },
        ],
        defaultValue: '关闭',
      },
      desc: '开启后可以使用客服对话系统',
    },
    {
      name: 'puppet',
      type: 'SingleSelect',
      property: {
        options: [
          {
            name: 'wechaty-puppet-wechat',
            color: 'deepPurple_0',
          },
          {
            name: 'wechaty-puppet-xp',
            color: 'indigo_0',
          },
          {
            name: 'wechaty-puppet-padlocal',
            color: 'blue_0',
          },
        ],
        defaultValue: 'wechaty-puppet-wechat',
      },
      desc: 'puppet名称，目前支持3中puppet',
    },
    {
      name: 'wechaty-token',
      type: 'SingleText',
      property: {
        defaultValue: '',
      },
      desc: 'puppet的token，仅当使用padlocal时需要填写',
    },
    {
      name: 'MQTT控制',
      type: 'SingleSelect',
      property: {
        options: [
          {
            name: '开启',
            color: 'deepPurple_0',
          },
          {
            name: '关闭',
            color: 'indigo_0',
          },
        ],
        defaultValue: '关闭',
      },
      desc: '开启可以通过MQTT控制微信',
    },
    {
      name: 'MQTT推送',
      type: 'SingleSelect',
      property: {
        options: [
          {
            name: '开启',
            color: 'deepPurple_0',
          },
          {
            name: '关闭',
            color: 'indigo_0',
          },
        ],
        defaultValue: '关闭',
      },
      desc: '开启后消息会发送到MQTT队列',
    },
    {
      name: 'MQTT用户名',
      type: 'SingleText',
      property: {
        defaultValue: '',
      },
      desc: 'MQTT用户名',
    },
    {
      name: 'MQTT密码',
      type: 'SingleText',
      property: {
        defaultValue: '',
      },
      desc: 'MQTT接入地址',
    },
    {
      name: 'MQTT接入地址',
      type: 'SingleText',
      property: {
        defaultValue: '',
      },
      desc: 'MQTT接入地址',
    },
    {
      name: 'MQTT端口号',
      type: 'SingleText',
      property: {
        defaultValue: '1883',
      },
      desc: 'MQTT端口号',
    },
  ],
  name: '系统配置',
  defaultRecords: [ {
    fields: {
      机器人名称: '未设置',
    },
  } ],
}

const switchSheet: Sheet = {
  fields: [
    {
      name: '功能项',
      type: 'SingleText',
      property: {
        defaultValue: '',
      },
    },
    {
      name: '启用状态',
      type: 'SingleSelect',
      property: {
        options: [
          {
            name: '开启',
            color: 'deepPurple_0',
          },
          {
            name: '关闭',
            color: 'indigo_0',
          },
        ],
      },
    },
    {
      name: '说明',
      type: FieldType.Text,
    },
  ],
  name: '功能开关',
  defaultRecords: [
    {
      fields: {
        功能项: '智能问答',
        启用状态: '关闭',
        说明: '开启后可以使用微信对话平台只能问答',
      },
    },
    {
      fields: {
        功能项: 'AT回复',
        启用状态: '关闭',
        说明: '开启后只有@好友才会回复问答',
      },
    },
    {
      fields: {
        功能项: '不同群个性回复',
        启用状态: '开启',
        说明: '开启后不同群相同问题可以得到不同答案',
      },
    },
    {
      fields: {
        功能项: '群白名单',
        启用状态: '开启',
        说明: '开启后只有白名单内的群会自动问答',
      },
    },
    {
      fields: {
        功能项: '好友白名单',
        启用状态: '开启',
        说明: '开启后只有白名单内的好友自动问答',
      },
    },
    {
      fields: {
        功能项: '消息上传到维格表',
        启用状态: '开启',
        说明: '开启后消息记录会自动上传到维格表的【消息记录】表',
      },
    },
    {
      fields: {
        功能项: 'IM对话',
        启用状态: '开启',
        说明: '开启后可以使用客服对话系统',
      },
    },
    {
      fields: {
        功能项: 'MQTT控制',
        启用状态: '关闭',
        说明: '开启可以通过MQTT控制微信',
      },
    },
    {
      fields: {
        功能项: 'MQTT推送',
        启用状态: '关闭',
        说明: '开启后消息会发送到MQTT队列',
      },
    },
  ],
}

// const recordsConfig = [{
//     fields: {
//         智能问答: '关闭',
//         对话平台token: '',
//         不同群个性回复: '关闭',
//         群白名单: '关闭',
//         好友白名单: '关闭',
//         消息上传到维格表: '开启',
//         IM对话: '关闭',
//         puppet: 'wechaty-puppet-xp',
//         'wechaty-token': '',
//         MQTT控制: '关闭',
//         MQTT推送: '关闭',
//         MQTT用户名: '',
//         MQTT密码: '',
//         MQTT接入地址: '',
//         MQTT端口号: '1883',
//     },
// }]

const contactSheet: Sheet = {
  fields: [
    {
      name: 'id',
      type: 'SingleText',
      property: {

      },
    },
    {
      name: 'name',
      type: 'SingleText',
      property: {
        defaultValue: '',
      },
    },
    {
      name: 'alias',
      type: 'SingleText',
      property: {
        defaultValue: '',
      },
    },
    {
      name: 'gender',
      type: 'SingleText',
      property: {
        defaultValue: '',
      },
    },
    {
      name: 'friend',
      type: 'Checkbox',
      property: {
        icon: 'white_check_mark',
      },
    },
    {
      name: 'type',
      type: 'SingleText',
      property: {
        defaultValue: '',
      },
    },
    {
      name: 'avatar',
      type: 'Text',
    },
    {
      name: 'phone',
      type: 'SingleText',
      property: {
        defaultValue: '',
      },
    },
    {
      name: 'file',
      type: 'Attachment',
    },
  ],
  name: '好友列表',
  defaultRecords: [],
}

export const qaSheet = {
  fields: [
    {
      name: '分类(必填)',
      type: 'Text',
    },
    {
      name: '问题(必填)',
      type: 'Text',
    },
    {
      name: '问题阈值(选填-默认0.9)',
      type: 'Text',
    },
    {
      name: '相似问题(多个用##分隔)',
      type: 'Text',
    },
    {
      name: '机器人回答(多个用##分隔)',
      type: 'Text',
    },
    {
      name: '是否停用(选填-默认FALSE)',
      type: 'Text',
    },
  ],
  name: '智能问答列表',
  defaultRecords: [
    {
      fields: {
        '分类(必填)': '社区通知',
        '问题(必填)': '社区通知',
        '问题阈值(选填-默认0.9)': '0.7',
        '相似问题(多个用##分隔)': '社区状态通知##社区里的通知##社区通知，急##看社区通知##社区服务通知##社区公示##社区公告',
        '机器人回答(多个用##分隔)': '{"multimsg":["Easy Chatbot Show25108313781@chatroom北辰香麓欣麓园社区公告，点击链接查看详情https://spcp52tvpjhxm.com.vika.cn/share/shrsf3Sf0BHitZlU62C0N"]}',
        '是否停用(选填-默认FALSE)': 'false',
      },
    },
    {
      fields: {
        '分类(必填)': '基础问答',
        '问题(必填)': 'What is Wechaty',
        '问题阈值(选填-默认0.9)': '0.7',
        '相似问题(多个用##分隔)': "what'swechaty",
        '机器人回答(多个用##分隔)': '{"multimsg":["Wechaty is an Open Source software application for building chatbots.LINE_BREAKGo to the https://wechaty.js.org/docs/wechaty for more information."]}',
        '是否停用(选填-默认FALSE)': 'false',
      },
    },
  ],
}

const roomListSheet = {
  fields: [
    {
      name: 'id',
      type: 'SingleText',
      property: {

      },
    },
    {
      id: 'fldgEKH5CjXu7',
      name: 'topic',
      type: 'SingleText',
      property: {
        defaultValue: '',
      },
      editable: true,
    },
    {
      id: 'fldu000ieNIL3',
      name: 'ownerId',
      type: 'SingleText',
      property: {
        defaultValue: '',
      },
      editable: true,
    },
    {
      id: 'fldP5pXik9Tw0',
      name: 'avatar',
      type: 'Text',
      editable: true,
    },
    {
      id: 'fldWB1gC5mrrg',
      name: 'adminIdList',
      type: 'Text',
      editable: true,
    },
    {
      id: 'fld95m7IYPajP',
      name: 'memberIdList',
      type: 'Text',
      editable: true,
    },
    {
      id: 'fldYg3WRl6auV',
      name: 'external',
      type: 'SingleText',
      property: {
        defaultValue: '',
      },
      editable: true,
    },
    {
      id: 'fldarlC9hzslN',
      name: 'file',
      type: 'Attachment',
      editable: true,
    },
  ],
  name: '群列表',
  defaultRecords: [],
}

const roomWhiteListSheet = {
  fields: [
    {
      id: 'fldxEzzn8r5ox',
      name: '群ID',
      type: 'SingleText',
      property: {
        defaultValue: '',
      },
      editable: true,
      isPrimary: true,
    },
    {
      id: 'fld9s9Sz7kmo3',
      name: '群名称',
      type: 'SingleText',
      property: {

      },
      editable: true,
    },
    {
      id: 'fldaic9DJDnZG',
      name: '群主昵称',
      type: 'SingleText',
      property: {

      },
      editable: true,
    },
    {
      id: 'fldSujdkqvifr',
      name: '群主微信号',
      type: 'SingleText',
      property: {

      },
      editable: true,
    },
    {
      id: 'fldKKH4aUXsWd',
      name: '备注',
      type: 'Text',
      editable: true,
    },
  ],
  name: '群白名单',
  defaultRecords: [],
}

const contactWhiteListSheet = {
  fields: [
    {
      id: 'fldxEzzn8r5ox',
      name: '好友ID',
      type: 'SingleText',
      property: {
        defaultValue: '',
      },
      editable: true,
      isPrimary: true,
    },
    {
      id: 'fld9s9Sz7kmo3',
      name: '昵称',
      type: 'SingleText',
      property: {

      },
      editable: true,
    },
    {
      id: 'fldKKH4aUXsWd',
      name: '备注',
      type: 'Text',
      editable: true,
    },
  ],
  name: '好友白名单',
  defaultRecords: [],
}

const messageSheet = {
  fields: [
    {
      name: 'timeHms',
      property: {
        defaultValue: '',
      },
      type: 'SingleText',
    },
    {
      name: 'name',
      property: {
        defaultValue: '',
      },
      type: 'SingleText',
    },
    {
      name: 'topic',
      property: {
        defaultValue: '',
      },
      type: 'SingleText',
    },
    {
      name: 'messagePayload',
      type: 'Text',
    },
    {
      name: 'wxid',
      property: {
        defaultValue: '',
      },
      type: 'SingleText',
    },
    {
      name: 'roomid',
      property: {
        defaultValue: '',
      },
      type: 'SingleText',
    },
    {
      name: 'messageType',
      property: {
        defaultValue: '',
      },
      type: 'SingleText',
    },
    {
      name: 'file',
      type: 'Attachment',
    },
  ],
  name: '消息记录',
  defaultRecords: [],
}

type Sheets = {
    [key: string]: Sheet
}

const sheets: Sheets = {
  configSheet,
  switchSheet,
  contactSheet,
  roomListSheet,
  commandSheet,
  messageSheet,
  // qaSheet,
  roomWhiteListSheet,
  contactWhiteListSheet,
}

export {
  sheets,
  type Sheets,
}

export default sheets
