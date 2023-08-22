/* eslint-disable sort-keys */

import type {
  Sheet,
  Field,
} from './Model'

const defaultRecords: any[] = []

const vikaRes = {
  code: 200,
  success: true,
  data: {
    fields: [
      {
        id: 'fldR4yxilvuH6',
        name: '流水号',
        type: 'SingleText',
        property: {},
        editable: true,
        isPrimary: true,
      },
      {
        id: 'flduRGcgRVa9G',
        name: '所属活动',
        type: 'SingleText',
        property: {},
        editable: true,
      },
      {
        id: 'fldayrbVKKnxu',
        name: '昵称',
        type: 'SingleText',
        property: {},
        editable: true,
      },
      {
        id: 'fld78OVXhKTsp',
        name: '备注名称',
        type: 'SingleText',
        property: {},
        editable: true,
      },
      {
        id: 'fldFc9ivIwQug',
        name: '群',
        type: 'SingleText',
        property: {},
        editable: true,
      },
      {
        id: 'fldJblWb1ib22',
        name: '创建时间',
        type: 'DateTime',
        property: {
          format: 'YYYY/MM/DD hh:mm',
          includeTime: true,
        },
        editable: true,
      },
      {
        id: 'fldMfKvatkmy8',
        name: '备注',
        type: 'Text',
        editable: true,
      },
    ],
  },
  message: 'SUCCESS',
}

const fields: Field[] = vikaRes.data.fields

const orderSheet: Sheet = {
  fields,
  name: '记录单',
  defaultRecords,
}

export {
  orderSheet,
}

export default orderSheet
