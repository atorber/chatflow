/* eslint-disable sort-keys */

import type {
  Sheet,
  Field,
} from './Model'

const vikaRes = {
  code: 200,
  success: true,
  data: {
    fields: [
      {
        id: 'fld2z5vYoVpDj',
        name: '编号',
        type: 'AutoNumber',
        editable: false,
        isPrimary: true,
      },
      {
        id: 'fldLu3kFD2KXA',
        name: '所属应用',
        type: 'SingleSelect',
        property: {
          options: [
            {
              id: 'optERx3jb2Th8',
              name: '智能问答',
              color: {
                name: 'deepPurple_0',
                value: '#E5E1FC',
              },
            },
            {
              id: 'optaboDXNaT3G',
              name: '活动管理',
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
        id: 'fld2dVtWMLEY2',
        name: '类型',
        type: 'SingleSelect',
        property: {
          options: [
            {
              id: 'optmgnFvK7hXM',
              name: '好友',
              color: {
                name: 'deepPurple_0',
                value: '#E5E1FC',
              },
            },
            {
              id: 'opti8WXldAIQM',
              name: '群',
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
        id: 'fldYEto44C9SX',
        name: '好友备注/昵称或群名称',
        type: 'SingleText',
        property: {},
        editable: true,
      },
      {
        id: 'fldQ9GAyDo5E4',
        name: '好友ID/群ID',
        type: 'SingleText',
        property: {},
        editable: true,
      },
      {
        id: 'fldJRmkN2jUmP',
        name: '备注说明',
        type: 'Text',
        editable: true,
      },
      {
        id: 'fldtDqBV4aKBN',
        name: '启用状态',
        type: 'SingleSelect',
        property: {
          options: [
            {
              id: 'optSfVsa6Fbtn',
              name: '开启',
              color: {
                name: 'deepPurple_0',
                value: '#E5E1FC',
              },
            },
            {
              id: 'opt51XlLYQ01W',
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
        id: 'fldae0lhHpBif',
        name: '配额',
        type: 'Number',
        property: {
          defaultValue: '20',
          precision: 0,
        },
        editable: true,
      },
    ],
  },
  message: 'SUCCESS',
}

const defaultRecords: any[] = []

const fields: Field[] = vikaRes.data.fields

export const whiteListSheet: Sheet = {
  fields,
  name: '白名单',
  defaultRecords,
}
