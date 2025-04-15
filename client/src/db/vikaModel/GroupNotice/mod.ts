/* eslint-disable sort-keys */

import type {
  Sheet,
  // Field,
} from '../Model'

import { replaceSyncStatus, actionState } from '../actionBar.js'

const name = '群发通知|GroupNotice'
const code = 'groupNoticeSheet'

const vikaFields = { code:200, success:true, data:{ fields:[ { id:'fld0UHVRdiQf7', name:'内容|text', type:'Text', editable:true, isPrimary:true }, { id:'fldVlR8cvlPiD', name:'类型|type', type:'SingleSelect', property:{ options:[ { id:'optkCf0YMOZBb', name:'好友|contact', color:{ name:'deepPurple_0', value:'#E5E1FC' } }, { id:'optkM07kKsmvd', name:'群|room', color:{ name:'indigo_0', value:'#DDE7FF' } } ] }, editable:true }, { id:'fldbWOCxhoByL', name:'好友备注(选填)|alias', type:'SingleText', property:{}, editable:true }, { id:'fldUoqVS4N8Rt', name:'昵称/群名称|name', type:'SingleText', property:{}, editable:true }, { id:'fldbuuw8Ga1H1', name:'好友ID/群ID(选填)|id', type:'SingleText', property:{}, editable:true }, { id:'fldFZOABfIQFV', name:'状态|state', type:'SingleSelect', property:{ options:[ { id:'optyYRK9V2I3P', name:'待发送|waiting', color:{ name:'deepPurple_0', value:'#E5E1FC' } }, { id:'optdZXivbniAi', name:'暂存|staging', color:{ name:'indigo_0', value:'#DDE7FF' } }, { id:'optYwbJenY36O', name:'发送成功|success', color:{ name:'blue_0', value:'#DDF5FF' } }, { id:'opt42EyDXhlfh', name:'发送失败|fail', color:{ name:'teal_0', value:'#D6F3E8' } } ] }, editable:true }, { id:'fldyr9g6lTMaW', name:'发送时间|pubTime', type:'DateTime', property:{ format:'YYYY-MM-DD HH:mm', includeTime:true, autoFill:true }, editable:true }, { id:'fldJgbb00qqoE', name:'信息|info', type:'Text', editable:true } ] }, message:'SUCCESS' }
let fields:any = vikaFields.data.fields

if (actionState[code]) {
  fields = replaceSyncStatus(fields)
}

const defaultRecords:any

= {
  code: 200,
  success: true,
  message: 'Request successful',
  data: {
    total: 1,
    pageNum: 1,
    pageSize: 1,
    records: [
      {
        recordId: 'recGovPlvkTWv',
        fields: {
          '内容|text': '示例消息',
          '类型|type': '好友|contact',
          '好友备注(选填)|alias': '张三',
          '昵称/群名称|name': '我是张三',
          '好友ID/群ID(选填)|id': 'zhangsan',
          '状态|state': '待发送|waiting',
          '发送时间|pubTime': 1693750559067,
          '信息|info': '示例消息',
          '同步状态|syncStatus': '未同步',
          '最后操作时间|lastOperationTime': 1702519578331,
          '操作|action': '选择操作',
        },
      },
    ],
  },
}

export const sheet: Sheet = {
  fields,
  name,
  defaultRecords:defaultRecords.data.records,
}
