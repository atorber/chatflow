/* eslint-disable sort-keys */

/* eslint-disable sort-keys */

import type {
  Sheet,
  // Field,
} from '../Model'

import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const vikaFields = JSON.parse(fs.readFileSync(path.join(__dirname, 'fields.json'), 'utf-8'))
const defaultRecords = JSON.parse(fs.readFileSync(path.join(__dirname, 'records.json'), 'utf-8'))

export const keywordsSheet: Sheet = {
  fields:vikaFields.data.fields,
  name: '关键词',
  defaultRecords:defaultRecords.data.records,
}
