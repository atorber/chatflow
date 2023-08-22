/* eslint-disable sort-keys */

import type {
  Sheet,
  Field,
} from './Model'

const recordRes = {
  code: 200,
  success: true,
  data: {
    total: 9,
    records: [
      {
        recordId: 'recWtsBiWnDvs',
        createdAt: 1692624128000,
        updatedAt: 1692624128000,
        fields: {
          指令名称: '帮助',
          说明: '获得操作指令集',
          类型: '系统指令',
        },
      },
      {
        recordId: 'reciPVDjL4xgs',
        createdAt: 1692624128000,
        updatedAt: 1692624128000,
        fields: {
          指令名称: '更新配置',
          说明: '更新系统配置，更改配置后需主动更新一次配置配置才会生效',
          类型: '系统指令',
        },
      },
      {
        recordId: 'recREbniqScgG',
        createdAt: 1692624128000,
        updatedAt: 1692624128000,
        fields: {
          指令名称: '更新定时提醒',
          说明: '更新定时提醒任务',
          类型: '系统指令',
        },
      },
      {
        recordId: 'rec5bM060uSfK',
        createdAt: 1692624128000,
        updatedAt: 1692635084000,
        fields: {
          指令名称: '更新通讯录',
          说明: '更新机器人的群列表和好友列表',
          类型: '系统指令',
        },
      },
      {
        recordId: 'recc8qIAjkTdm',
        createdAt: 1692635050000,
        updatedAt: 1692635137000,
        fields: {
          指令名称: '下载通讯录',
          说明: '下载通讯录xlsx表',
          类型: '系统指令',
        },
      },
      {
        recordId: 'recaSwnUkPb1S',
        createdAt: 1692624128000,
        updatedAt: 1692635112000,
        fields: {
          指令名称: '更新白名单',
          说明: '更新群白名单，白名单变动时需主动更新白名单',
          类型: '系统指令',
        },
      },
      {
        recordId: 'rec7dB38IK3Vr',
        createdAt: 1692624128000,
        updatedAt: 1692635121000,
        fields: {
          指令名称: '下载通知模板',
          说明: '下载通知模板',
          类型: '系统指令',
        },
      },
      {
        recordId: 'reczfMGOxdAeD',
        createdAt: 1692624128000,
        updatedAt: 1692624128000,
        fields: {
          指令名称: '启用问答',
          说明: 'TBD当前群启用智能问答',
          类型: '群指令',
        },
      },
      {
        recordId: 'rec82QnCkIVrK',
        createdAt: 1692624128000,
        updatedAt: 1692624128000,
        fields: {
          指令名称: '关闭问答',
          说明: 'TBD当前群关闭智能问答',
          类型: '群指令',
        },
      },
    ],
    pageNum: 1,
    pageSize: 9,
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
        id: 'fldCSCcQI7iEm',
        name: '指令名称',
        type: 'SingleText',
        property: {
          defaultValue: '',
        },
        editable: true,
        isPrimary: true,
      },
      {
        id: 'fldplyGKKgxME',
        name: '说明',
        type: 'Text',
        editable: true,
      },
      {
        id: 'fldopkUTne42Y',
        name: '类型',
        type: 'SingleSelect',
        property: {
          options: [
            {
              id: 'optYAC1AnMzGf',
              name: '系统指令',
              color: {
                name: 'deepPurple_0',
                value: '#E5E1FC',
              },
            },
            {
              id: 'opt7qitH0LOpj',
              name: '群指令',
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

const fields: Field[] = vikaRes.data.fields

const commandSheet: Sheet = {
  fields,
  name: '指令列表',
  defaultRecords,
}

export {
  commandSheet,
}

export default commandSheet
