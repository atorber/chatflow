/* eslint-disable sort-keys */
import type { Sheets } from './Model';
import { messageSheet } from './Message/mod';
import { keywordSheet } from './Keyword/mod';
import { sheet as envSheet } from './Env/mod';
import { sheet as statisticSheet } from './Statistic/mod';
import { sheet as contactSheet } from './Contact/mod';
import { sheet as qaSheet } from './Qa/mod';
import { roomSheet } from './Room/mod';
import { orderSheet } from './Order/mod';
// import contactWhiteListSheet from './ContactWhiteList'
import { sheet as noticeSheet } from './Notice/mod';
// import groupSheet from './ContactGroup'
import { sheet as whiteListSheet } from './WhiteList/mod';
import { stockSheet } from './Stock/mod';
import { sheet as groupNoticeSheet } from './GroupNotice/mod';
import { sheet as chatBotSheet } from './ChatBot/mod';
import { sheet as chatBotUserSheet } from './ChatBotUser/mod';
import { sheet as groupSheet } from './Group/mod';
import { sheet as welcomeSheet } from './Welcome/mod';
import { sheet as mediaSheet } from './Media/mod';
import { sheet as carpoolingSheet } from './Carpooling/mod';

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
  groupSheet,
  welcomeSheet,
  mediaSheet,
  carpoolingSheet,
  // stockSheet,
  // switchSheet,
  // roomWhiteListSheet,
  // contactWhiteListSheet,
};

export { sheets, stockSheet };

export default sheets;
