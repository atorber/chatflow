/* eslint-disable sort-keys */

import type {
  Sheet,
  // Field,
} from '../Model'

import { vikaFields } from './fields.js'
import { defaultRecords } from './records.js'

import { replaceSyncStatus, actionState } from '../actionBar.js'

const name = '统计打卡|Statistic'
const code = 'statisticSheet'

let fields:any = vikaFields.data.fields

if (actionState[code]) {
  fields = replaceSyncStatus(fields)
}

export const sheet: Sheet = {
  fields,
  name,
  defaultRecords:defaultRecords.data.records,
}
