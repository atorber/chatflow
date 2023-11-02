/* eslint-disable sort-keys */

import type {
  Sheet,
  // Field,
} from '../Model'

import { replaceSyncStatus, actionState } from '../actionBar.js'

const name = '定时提醒|Notice'
const code = 'noticeSheet'

const vikaFields = { code:200, success:true, data:{ fields:[ { id:'fldHwSik2Eolp', name:'内容|desc', type:'Text', editable:true, isPrimary:true }, { id:'fldxCZRZfTDn6', name:'通知目标类型|type', type:'SingleSelect', property:{ options:[ { id:'optGyHAfqtB7r', name:'好友', color:{ name:'deepPurple_0', value:'#E5E1FC' } }, { id:'optKYW1f87glJ', name:'群', color:{ name:'indigo_0', value:'#DDE7FF' } } ] }, editable:true }, { id:'flds6abj33bLu', name:'昵称/群名称|name', type:'SingleText', property:{ defaultValue:'' }, editable:true }, { id:'fld3YJmN9LacI', name:'好友ID/群ID(选填)|id', type:'SingleText', property:{ defaultValue:'' }, editable:true }, { id:'fldIf0aM9UZQD', name:'好友备注(选填)|alias', type:'SingleText', property:{}, editable:true }, { id:'fldSJwhk9I0cN', name:'时间|time', type:'DateTime', property:{ format:'YYYY-MM-DD HH:mm', includeTime:true, autoFill:true }, editable:true }, { id:'fldT5ozWV1cYy', name:'周期|cycle', type:'SingleSelect', property:{ options:[ { id:'optU9qx2FaT9M', name:'无重复', color:{ name:'deepPurple_0', value:'#E5E1FC' } }, { id:'opt75gotqemx6', name:'每天', color:{ name:'indigo_0', value:'#DDE7FF' } }, { id:'optQZx96GV6G7', name:'每周', color:{ name:'blue_0', value:'#DDF5FF' } }, { id:'opt6D3HqKELUp', name:'每月', color:{ name:'teal_0', value:'#D6F3E8' } }, { id:'optY4Rgw9pckJ', name:'每小时', color:{ name:'green_0', value:'#DCF3D1' } }, { id:'optNK4nRKpArH', name:'每分钟', color:{ name:'yellow_0', value:'#FFF6D8' } }, { id:'optQxlAbChMus', name:'每5分钟', color:{ name:'orange_0', value:'#FFEECC' } }, { id:'optLG0qdcQdV4', name:'每10分钟', color:{ name:'tangerine_0', value:'#FFE4CC' } }, { id:'optg7XF0JZOwl', name:'每15分钟', color:{ name:'pink_0', value:'#FFE2E8' } }, { id:'optHsQpqBKrjz', name:'每30分钟', color:{ name:'red_0', value:'#F9D8D7' } }, { id:'optirXg6VoJuy', name:'每季度', color:{ name:'deepPurple_0', value:'#E5E1FC' } } ] }, editable:true }, { id:'fldlANZT8mFsn', name:'启用状态|state', type:'SingleSelect', property:{ options:[ { id:'opt3h2FSNwAhs', name:'开启', color:{ name:'deepPurple_0', value:'#E5E1FC' } }, { id:'optZ7OiRN3xdQ', name:'关闭', color:{ name:'indigo_0', value:'#DDE7FF' } } ] }, editable:true } ] }, message:'SUCCESS' }
let fields:any = vikaFields.data.fields

if (actionState[code]) {
  fields = replaceSyncStatus(fields)
}

const defaultRecords:any = { code:200, success:true, data:{ total:1, records:[ { recordId:'recpHWSXRDKlT', createdAt:1693750783000, updatedAt:1694055402000, fields:{ '内容|desc':'测试5分钟提醒', '时间|time':1692597600000, '周期|cycle':'每5分钟', '启用状态|state':'开启', '昵称/群名称|name':'luyuchao', '通知目标类型|type':'好友' } } ], pageNum:1, pageSize:1 }, message:'SUCCESS' }

export const sheet: Sheet = {
  fields,
  name,
  defaultRecords:defaultRecords.data.records,
}
