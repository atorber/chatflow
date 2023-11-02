/* eslint-disable sort-keys */

import type {
  Sheet,
} from '../Model'

const vikaFields = { code:200, success:true, data:{ fields:[ { id:'fld7J6pZsrNat', name:'时间|timeHms', type:'SingleText', property:{ defaultValue:'' }, editable:true, isPrimary:true }, { id:'fldYaWgbe2iEG', name:'发送者|name', type:'SingleText', property:{ defaultValue:'' }, editable:true }, { id:'fldaLPuahrn7S', name:'好友备注|alias', type:'SingleText', property:{ defaultValue:'' }, editable:true }, { id:'fld5E5KJmzUow', name:'群名称|topic', type:'SingleText', property:{ defaultValue:'' }, editable:true }, { id:'fld07r2ePsUiV', name:'接收人|listener', type:'SingleText', property:{}, editable:true }, { id:'fldQJl6upgfYd', name:'消息内容|messagePayload', type:'Text', editable:true }, { id:'fldnxD3QoudNs', name:'文件图片|file', type:'Attachment', editable:true }, { id:'fldVBdInXiBr3', name:'消息类型|messageType', type:'SingleText', property:{ defaultValue:'' }, editable:true }, { id:'fldAivHA8anFP', name:'好友ID|wxid', type:'SingleText', property:{ defaultValue:'' }, editable:true }, { id:'fldOCt60zYh8f', name:'接收人ID|listenerid', type:'SingleText', property:{}, editable:true }, { id:'fldXswnj8SFxo', name:'群ID|roomid', type:'SingleText', property:{ defaultValue:'' }, editable:true }, { id:'fldkTLOkFxGdP', name:'发送者头像|wxAvatar', type:'Text', editable:true }, { id:'fldkTLOkFxGdP2', name:'群头像|roomAvatar', type:'Text', editable:true }, { id:'fldkTLOkFxGdP3', name:'接收人头像|listenerAvatar', type:'Text', editable:true }, { id:'fldEavgqazETa', name:'消息ID|messageId', type:'SingleText', property:{ defaultValue:'' }, editable:true } ] }, message:'SUCCESS' }
const defaultRecords = { code:200, success:true, data:{ total:0, records:[], pageNum:1, pageSize:0 }, message:'SUCCESS' }

export const messageSheet: Sheet = {
  fields:vikaFields.data.fields,
  name: '消息记录|Message',
  defaultRecords:defaultRecords.data.records,
}
