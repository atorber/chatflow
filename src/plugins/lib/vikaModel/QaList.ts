/* eslint-disable sort-keys */

import type {
  Sheet,
  Field,
} from './Model'

const recordRes = {
  code: 200,
  success: true,
  data: {
    total: 2,
    records: [
      {
        recordId: 'rec0HdqkdrCsy',
        createdAt: 1670218155000,
        updatedAt: 1670218155000,
        fields: {
          '是否停用(选填-默认FALSE)': 'false',
          '相似问题(多个用##分隔)': '社区状态通知##社区里的通知##社区通知，急##看社区通知##社区服务通知##社区公示##社区公告',
          '问题(必填)': '社区通知',
          '分类(必填)': '社区通知',
          '机器人回答(多个用##分隔)': '{"multimsg":["Easy Chatbot Show25108313781@chatroom北辰香麓欣麓园社区公告，点击链接查看详情https://spcp52tvpjhxm.com.vika.cn/share/shrsf3Sf0BHitZlU62C0N"]}',
          '问题阈值(选填-默认0.9)': '0.7',
        },
      },
      {
        recordId: 'recnsUhNejZb8',
        createdAt: 1670218155000,
        updatedAt: 1670218155000,
        fields: {
          '是否停用(选填-默认FALSE)': 'false',
          '相似问题(多个用##分隔)': "what'swechaty",
          '问题(必填)': 'What is Wechaty',
          '分类(必填)': '基础问答',
          '机器人回答(多个用##分隔)': '{"multimsg":["Wechaty is an Open Source software application for building chatbots.LINE_BREAKGo to the https://wechaty.js.org/docs/wechaty for more information."]}',
          '问题阈值(选填-默认0.9)': '0.7',
        },
      },
    ],
    pageNum: 1,
    pageSize: 2,
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
        id: 'fldho5KU1iGhU',
        name: '分类(必填)',
        type: 'Text',
        editable: true,
        isPrimary: true,
      },
      {
        id: 'fldawxa55XjvG',
        name: '问题(必填)',
        type: 'Text',
        editable: true,
      },
      {
        id: 'fldzhaT6r2uTU',
        name: '问题阈值(选填-默认0.9)',
        type: 'Text',
        editable: true,
      },
      {
        id: 'fldREsAJJLzzT',
        name: '相似问题(多个用##分隔)',
        type: 'Text',
        editable: true,
      },
      {
        id: 'fldn2DNCN15xy',
        name: '机器人回答(多个用##分隔)',
        type: 'Text',
        editable: true,
      },
      {
        id: 'fldCNMdtG6kcO',
        name: '是否停用(选填-默认FALSE)',
        type: 'Text',
        editable: true,
      },
    ],
  },
  message: 'SUCCESS',
}

const fields: Field[] = vikaRes.data.fields

const qaSheet: Sheet = {
  fields,
  name: '智能问答列表',
  defaultRecords,
}

export {
  qaSheet,
}

export default qaSheet
