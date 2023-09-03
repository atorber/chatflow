/* eslint-disable sort-keys */
import type {
  Sheets,
} from './Model'
import { messageSheet } from './Message/mod.js'
import { keywordsSheet } from './Keywords/mod.js'
import { sheet as configSheet } from './EnvConfig/mod.js'
import { sheet as statisticsSheet } from './Statistics/mod.js'
import { sheet as contactSheet } from './Contact/mod.js'
import { sheet as qaSheet } from './QaList/mod.js'
import { roomListSheet } from './Room/mod.js'
import { orderSheet } from './Order/mod.js'
// import contactWhiteListSheet from './ContactWhiteList.js'
import { sheet as noticeSheet } from './Notice/mod.js'
// import groupSheet from './ContactGroup.js'
import { sheet as whiteListSheet } from './WhiteList/mod.js'
import { stockSheet } from './Stock/mod.js'
import { sheet as groupNotificationsSheet } from './GroupNotifications/mod.js'

const sheets: Sheets = {
  qaSheet,
  orderSheet,
  keywordsSheet,
  configSheet,
  contactSheet,
  roomListSheet,
  whiteListSheet,
  noticeSheet,
  statisticsSheet,
  groupNotificationsSheet,
  messageSheet,
  // stockSheet,
  // groupSheet,
  // switchSheet,
  // roomWhiteListSheet,
  // contactWhiteListSheet,
}

export {
  sheets,
  stockSheet,
}

export default sheets
