/* eslint-disable sort-keys */

import type {
  Sheet,
  // Field,
} from '../Model';
import { vikaFields } from './fields.js';
import { defaultRecords } from './records.js';

export const sheet: Sheet = {
  fields: vikaFields.data.fields,
  name: '分组|Group',
  defaultRecords: defaultRecords.data.records,
};
