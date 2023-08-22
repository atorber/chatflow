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
        id: 'flducRGstJm4G',
        name: '编号',
        type: 'AutoNumber',
        editable: false,
        isPrimary: true,
      },
      {
        id: 'fldS2qY3B6uOk',
        name: '类型',
        type: 'SingleSelect',
        property: {
          options: [
            {
              id: 'opt6fBlAPwEE1',
              name: '活动报名',
              color: {
                name: 'deepPurple_0',
                value: '#E5E1FC',
              },
            },
            {
              id: 'optuY7dWBclIP',
              name: '签到打卡',
              color: {
                name: 'indigo_0',
                value: '#DDE7FF',
              },
            },
            {
              id: 'optaQEWHblssw',
              name: '统计表',
              color: {
                name: 'blue_0',
                value: '#DDF5FF',
              },
            },
          ],
        },
        editable: true,
      },
      {
        id: 'fldDi1hgdGFW8',
        name: '描述（必填）',
        type: 'Text',
        editable: true,
      },
      {
        id: 'fldql5iW9Z8LQ',
        name: '开始时间（选填）',
        type: 'DateTime',
        property: {
          format: 'YYYY/MM/DD hh:mm',
          includeTime: true,
        },
        editable: true,
      },
      {
        id: 'fldGDkPGXeeJv',
        name: '时长（小时，选填）',
        type: 'Number',
        property: {
          defaultValue: '1',
          precision: 0,
        },
        editable: true,
      },
      {
        id: 'fldTzHmGu71f5',
        name: '限制人数（选填）',
        type: 'Number',
        property: {
          defaultValue: '99',
          precision: 0,
        },
        editable: true,
      },
      {
        id: 'fldg4yseDvzBt',
        name: '地点（选填）',
        type: 'SingleText',
        property: {},
        editable: true,
      },
      {
        id: 'fldAWHEibwP9V',
        name: '周期（选填）',
        type: 'SingleSelect',
        property: {
          options: [
            {
              id: 'optDJBv6a0nGA',
              name: '周一',
              color: {
                name: 'indigo_0',
                value: '#DDE7FF',
              },
            },
            {
              id: 'optqwxylGq4gk',
              name: '周二',
              color: {
                name: 'blue_0',
                value: '#DDF5FF',
              },
            },
            {
              id: 'optiLA3g9p0US',
              name: '周三',
              color: {
                name: 'teal_0',
                value: '#D6F3E8',
              },
            },
            {
              id: 'opta7yYG35FhP',
              name: '周四',
              color: {
                name: 'green_0',
                value: '#DCF3D1',
              },
            },
            {
              id: 'optOzVAxsGgeH',
              name: '周五',
              color: {
                name: 'yellow_0',
                value: '#FFF6D8',
              },
            },
            {
              id: 'opt8LNqB9K3j0',
              name: '周六',
              color: {
                name: 'orange_0',
                value: '#FFEECC',
              },
            },
            {
              id: 'optrtWX3K62Xb',
              name: '周日',
              color: {
                name: 'tangerine_0',
                value: '#FFE4CC',
              },
            },
          ],
        },
        editable: true,
      },
      {
        id: 'fldfXgFFOVmbe',
        name: '关联群名称（选填）',
        type: 'Text',
        editable: true,
      },
      {
        id: 'fldw9jP3UNk6I',
        name: '关联群ID（选填）',
        type: 'Text',
        editable: true,
      },
    ],
  },
  message: 'SUCCESS',
}
const defaultRecords: any[] = []

const fields: Field[] = vikaRes.data.fields

const statisticsSheet: Sheet = {
  fields,
  name: '统计打卡',
  defaultRecords,
}

export {
  statisticsSheet,
}

export default statisticsSheet
