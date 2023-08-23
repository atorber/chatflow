/* eslint-disable sort-keys */
import type {
  Sheets,
} from './Model'
import { messageSheet } from './Message/mod.js'
import { keywordsSheet } from './Keywords/mod.js'
import { configSheet } from './EnvConfig/mod.js'
import { statisticsSheet } from './Statistics/mod.js'
import { contactSheet } from './Contact/mod.js'
// import qaSheet from './QaList.js'
import { roomListSheet } from './Room/mod.js'
import { orderSheet } from './Order/mod.js'
// import contactWhiteListSheet from './ContactWhiteList.js'
import { noticeSheet } from './Notice/mod.js'
// import groupSheet from './ContactGroup.js'
import { whiteListSheet } from './WhiteList/mod.js'
import { stockSheet } from './Stock/mod.js'

const sheets: Sheets = {
  configSheet,
  contactSheet,
  roomListSheet,
  whiteListSheet,
  keywordsSheet,
  noticeSheet,
  statisticsSheet,
  orderSheet,
  messageSheet,
  // stockSheet,
  // groupSheet,
  // switchSheet,
  // qaSheet,
  // roomWhiteListSheet,
  // contactWhiteListSheet,
}

export {
  sheets,
  stockSheet,
}

export default sheets
