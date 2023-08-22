/* eslint-disable sort-keys */
import type {
  Sheets,
} from './Model'
import messageSheet from './Message.js'
import commandSheet from './CommandList.js'
import configSheet from './EnvConfig.js'
import statisticsSheet from './Statistics.js'
import contactSheet from './Contact.js'
// import qaSheet from './QaList.js'
import roomListSheet from './Room.js'
import orderSheet from './Order.js'
// import contactWhiteListSheet from './ContactWhiteList.js'
import noticeSheet from './Notice.js'
// import groupSheet from './ContactGroup.js'
import { whiteListSheet } from './WhiteList.js'
import { stockSheet } from './Stock.js'

const sheets: Sheets = {
  configSheet,
  // switchSheet,
  commandSheet,
  contactSheet,
  roomListSheet,
  // qaSheet,
  // roomWhiteListSheet,
  // contactWhiteListSheet,
  statisticsSheet,
  orderSheet,
  whiteListSheet,
  // groupSheet,
  noticeSheet,
  messageSheet,
  stockSheet,
}

export {
  sheets,
}

export default sheets
