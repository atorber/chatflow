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
        recordId: 'receVDywmpsfA',
        createdAt: 1692668846000,
        updatedAt: 1692669351000,
        fields: {
          成本: 3.5,
          持仓数量: 1000,
          代码: '000725',
          名称: '京东方A',
          更新日期: 1692633600000,
        },
      },
      {
        recordId: 'recfjpnAcV3ri',
        createdAt: 1692668846000,
        updatedAt: 1692669361000,
        fields: {
          成本: 20,
          持仓数量: 100,
          代码: '601360',
          名称: '三六零',
          更新日期: 1692633600000,
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
        id: 'flddUjEnxQVfD',
        name: '代码',
        type: 'SingleText',
        property: {
          defaultValue: '',
        },
        editable: true,
        isPrimary: true,
      },
      {
        id: 'fldtW1IzIjo17',
        name: '名称',
        type: 'SingleText',
        property: {},
        editable: true,
      },
      {
        id: 'fldGURG38JP2i',
        name: '持仓数量',
        type: 'Number',
        property: {
          precision: 0,
        },
        editable: true,
      },
      {
        id: 'fldAx6UC5oJv5',
        name: '成本',
        type: 'Number',
        property: {
          precision: 2,
        },
        editable: true,
      },
      {
        id: 'fldwsvP1BUoSw',
        name: '更新日期',
        type: 'DateTime',
        property: {
          format: 'YYYY/MM/DD',
          includeTime: false,
        },
        editable: true,
      },
    ],
  },
  message: 'SUCCESS',
}

const fields: Field[] = vikaRes.data.fields

const stockSheet: Sheet = {
  fields,
  name: '股票提醒',
  defaultRecords,
}

export {
  stockSheet,
}

export default stockSheet
