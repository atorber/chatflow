/* eslint-disable sort-keys */

/* eslint-disable sort-keys */

/* eslint-disable sort-keys */

import type {
  Sheet,
  // Field,
} from '../Model'

import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import { replaceSyncStatus, actionState } from '../actionBar.js'

const name = '环境变量|Env'
const code = 'envSheet'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const vikaFields = JSON.parse(fs.readFileSync(path.join(__dirname, 'fields.json'), 'utf-8'))
let fields = vikaFields.data.fields

if (actionState[code]) {
  fields = replaceSyncStatus(fields)
}

const defaultRecords = JSON.parse(fs.readFileSync(path.join(__dirname, 'records.json'), 'utf-8'))

export const sheet: Sheet = {
  fields,
  name,
  defaultRecords:defaultRecords.data.records,
}
