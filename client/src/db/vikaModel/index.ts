/* eslint-disable sort-keys */
import type {
  Sheets,
} from './Model'
import { messageSheet } from './Message/mod.js'
import { keywordSheet } from './Keyword/mod.js'
import { sheet as envSheet } from './Env/mod.js'
import { sheet as statisticSheet } from './Statistic/mod.js'
import { sheet as contactSheet } from './Contact/mod.js'
import { sheet as qaSheet } from './Qa/mod.js'
import { roomSheet } from './Room/mod.js'
import { orderSheet } from './Order/mod.js'
// import contactWhiteListSheet from './ContactWhiteList.js'
import { sheet as noticeSheet } from './Notice/mod.js'
// import groupSheet from './ContactGroup.js'
import { sheet as whiteListSheet } from './WhiteList/mod.js'
import { stockSheet } from './Stock/mod.js'
import { sheet as groupNoticeSheet } from './GroupNotice/mod.js'
import { sheet as chatBotSheet } from './ChatBot/mod.js'
import { sheet as chatBotUserSheet } from './ChatBotUser/mod.js'
import { sheet as groupSheet } from './Group/mod.js'

const sheets: Sheets = {
  qaSheet,
  orderSheet,
  keywordSheet,
  envSheet,
  contactSheet,
  roomSheet,
  whiteListSheet,
  noticeSheet,
  statisticSheet,
  groupNoticeSheet,
  messageSheet,
  chatBotSheet,
  chatBotUserSheet,
  // stockSheet,
  groupSheet,
  // switchSheet,
  // roomWhiteListSheet,
  // contactWhiteListSheet,
}

export {
  sheets,
  stockSheet,
}

export default sheets
