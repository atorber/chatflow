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
        id: 'fldfVJETOZGFh',
        name: '编号|serialNumber',
        type: 'SingleText',
        property: {},
        editable: true,
        isPrimary: true,
      },
      {
        id: 'fldg36krPnZRM',
        name: '活动编号|code',
        type: 'SingleText',
        property: {},
        editable: true,
      },
      {
        id: 'fldjWxmF6I6z8',
        name: '活动描述|desc',
        type: 'Text',
        editable: true,
      },
      {
        id: 'fld0RUDgKs2lo',
        name: '昵称|name',
        type: 'SingleText',
        property: {},
        editable: true,
      },
      {
        id: 'fldBL0jp8pFuS',
        name: '备注名称(选填)|alias',
        type: 'SingleText',
        property: {},
        editable: true,
      },
      {
        id: 'fldXO7uQw6c1L',
        name: '好友ID(选填)|wxid',
        type: 'SingleText',
        property: {},
        editable: true,
      },
      {
        id: 'fldWsOpoiX9r4',
        name: '群名称|topic',
        type: 'SingleText',
        property: {},
        editable: true,
      },
      {
        id: 'fldKsSCeStEsI',
        name: '创建时间|createdAt',
        type: 'DateTime',
        property: {
          format: 'YYYY-MM-DD HH:mm',
          includeTime: true,
          autoFill: true,
        },
        editable: true,
      },
      { id: 'fldfP5qQKvF24', name: '备注|info', type: 'Text', editable: true },
    ],
  },
  message: 'SUCCESS',
};

const defaultRecords = {
  code: 200,
  success: true,
  message: 'Request successful',
  data: {
    total: 1,
    pageNum: 1,
    pageSize: 1,
    records: [
      // {
      //   recordId: 'rechd25gDKrw7',
      //   fields: {
      //     '编号|serialNumber': '123',
      //     '活动编号|code': '4',
      //     '活动描述|desc': '示例活动',
      //     '昵称|name': '大师',
      //     '备注名称(选填)|alias': 'chatflow作者',
      //     '好友ID(选填)|wxid': 'ledongmao',
      //     '群名称|topic': '瓦力是群主',
      //     '创建时间|createdAt': '1702522321914',
      //     '备注|info': '示例订单信息',
      //   },
      // },
    ],
  },
};

export const orderSheet: Sheet = {
  fields: vikaFields.data.fields,
  name: '记录单|Order',
  defaultRecords: defaultRecords.data.records,
};
