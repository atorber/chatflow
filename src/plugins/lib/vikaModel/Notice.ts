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
        id: 'fldoYSvRnvc1f',
        name: '内容',
        type: 'Text',
        editable: true,
        isPrimary: true,
      },
      {
        id: 'fld3qG3X0ZlFs',
        name: '通知目标类型',
        type: 'SingleSelect',
        property: {
          options: [
            {
              id: 'optWMNg5xJJZS',
              name: '好友',
              color: {
                name: 'deepPurple_0',
                value: '#E5E1FC',
              },
            },
            {
              id: 'optNtIR7ecTja',
              name: '群',
              color: {
                name: 'indigo_0',
                value: '#DDE7FF',
              },
            },
          ],
          defaultValue: '好友',
        },
        editable: true,
      },
      {
        id: 'fldiRwFyYEIYX',
        name: '好友备注/昵称或群名称',
        type: 'SingleText',
        desc: '类型为好友时优先匹配好友ID、备注、昵称，类型为群时优先匹配群ID、群名称',
        property: {
          defaultValue: '',
        },
        editable: true,
      },
      {
        id: 'fldiRwFyYEIYX0',
        name: '好友ID/群ID',
        type: 'SingleText',
        desc:'选填，使用wehcaty-puppet-wechat时因id会变化，不要填写',
        property: {
          defaultValue: '',
        },
        editable: true,
      },
      {
        id: 'fldoCm0thVXmq',
        name: '时间',
        type: 'DateTime',
        property: {
          format: 'YYYY/MM/DD HH:mm',
          includeTime: true,
        },
        editable: true,
      },
      {
        id: 'fldTnEtGqFIt6',
        name: '周期',
        type: 'SingleSelect',
        property: {
          options: [
            {
              id: 'optrcyujqFycE',
              name: '无重复',
              color: {
                name: 'deepPurple_0',
                value: '#E5E1FC',
              },
            },
            {
              id: 'optpUa6oOH7mb',
              name: '每天',
              color: {
                name: 'indigo_0',
                value: '#DDE7FF',
              },
            },
            {
              id: 'opt1PXrPyuWwu',
              name: '每周',
              color: {
                name: 'blue_0',
                value: '#DDF5FF',
              },
            },
            {
              id: 'optiiAF9BNYKj',
              name: '每月',
              color: {
                name: 'yellow_0',
                value: '#FFF6D8',
              },
            },
            {
              id: 'optnWPpccOnnb',
              name: '每小时',
              color: {
                name: 'teal_0',
                value: '#D6F3E8',
              },
            },
            {
              id: 'optrcSxCfZzyR',
              name: '每分钟',
              color: {
                name: 'green_0',
                value: '#DCF3D1',
              },
            },
            {
              id: 'optt9JWn7cSbF',
              name: '每5分钟',
              color: {
                name: 'orange_0',
                value: '#FFEECC',
              },
            },
            {
              id: 'optkEeIO3oiGP',
              name: '每10分钟',
              color: {
                name: 'tangerine_0',
                value: '#FFE4CC',
              },
            },
            {
              id: 'opt6FET9p070f',
              name: '每15分钟',
              color: {
                name: 'pink_0',
                value: '#FFE2E8',
              },
            },
            {
              id: 'optWUcO5sbqGN',
              name: '每30分钟',
              color: {
                name: 'red_0',
                value: '#F9D8D7',
              },
            },
            {
              id: 'optQuO5UYFHrZ',
              name: '每季度',
              color: {
                name: 'deepPurple_0',
                value: '#E5E1FC',
              },
            },
          ],
        },
        editable: true,
      },
      {
        id: 'fldiC33Rgidk5',
        name: '启用状态',
        type: 'SingleSelect',
        property: {
          options: [
            {
              id: 'optJAukD9h9vd',
              name: '开启',
              color: {
                name: 'deepPurple_0',
                value: '#E5E1FC',
              },
            },
            {
              id: 'optXdfUlXCcYG',
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
    ],
  },
  message: 'SUCCESS',
}
const defaultRecords: any[] = []

const fields: Field[] = vikaRes.data.fields

const noticeSheet: Sheet = {
  fields,
  name: '定时提醒',
  defaultRecords,
}

export {
  noticeSheet,
}

export default noticeSheet
