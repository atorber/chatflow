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
        id: 'fldr8wtGTGr4o',
        name: 'timeHms',
        type: 'SingleText',
        property: {
          defaultValue: '',
        },
        editable: true,
        isPrimary: true,
      },
      {
        id: 'fldIDa0zPtgYo',
        name: 'name',
        type: 'SingleText',
        property: {
          defaultValue: '',
        },
        editable: true,
      },
      {
        id: 'fldIDa0zPtgYo0',
        name: 'alias',
        type: 'SingleText',
        property: {
          defaultValue: '',
        },
        editable: true,
      },
      {
        id: 'fldCbOzc2qfVn',
        name: 'topic',
        type: 'SingleText',
        property: {
          defaultValue: '',
        },
        editable: true,
      },
      {
        id: 'fldQYW3U9dvKm',
        name: 'messagePayload',
        type: 'Text',
        editable: true,
      },
      {
        id: 'fldh1g0q0rx9M',
        name: 'file',
        type: 'Attachment',
        editable: true,
      },
      {
        id: 'fldiRwFyYEIYX',
        name: 'messageType',
        type: 'SingleText',
        property: {
          defaultValue: '',
        },
        editable: true,
      },
      {
        id: 'fldJ9S09Ib9ZT',
        name: 'wxid',
        type: 'SingleText',
        property: {
          defaultValue: '',
        },
        editable: true,
      },
      {
        id: 'fldH7x4REKsrD',
        name: 'roomid',
        type: 'SingleText',
        property: {
          defaultValue: '',
        },
        editable: true,
      },
      {
        id: 'fldiRwFyYEIYX',
        name: 'messageId',
        type: 'SingleText',
        property: {
          defaultValue: '',
        },
        editable: true,
      },
    ],
  },
  message: 'SUCCESS',
}

const defaultRecords: any[] = []

const fields: Field[] = vikaRes.data.fields

const messageSheet: Sheet = {
  fields,
  name: '消息记录',
  defaultRecords,
}

export {
  messageSheet,
}

export default messageSheet
