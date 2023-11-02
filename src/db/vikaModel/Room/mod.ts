/* eslint-disable sort-keys */

/* eslint-disable sort-keys */

import type {
  Sheet,
  // Field,
} from '../Model'
import { vikaFields } from './fields.js'
import { defaultRecords } from './records.js'

export const roomSheet: Sheet = {
  fields:vikaFields.data.fields,
  name: '群列表|Room',
  defaultRecords:defaultRecords.data.records,
}
