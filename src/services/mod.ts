import { MessageChat } from './messageService.js'
import { LarkChat } from './larkService.js'
import { EnvChat } from './envService.js'
import { WhiteListChat, WhiteList } from './whiteListService.js'
import { GroupNoticeChat } from './groupNoticeService.js'
import { RoomChat } from './roomService.js'
import { ContactChat } from './contactService.js'
import { ActivityChat } from './activityService.js'
import { KeywordChat } from './keywordService.js'
import { NoticeChat } from './noticeService.js'
import { QaChat } from './qaService.js'
import { OrderChat } from './orderService.js'
import { StatisticChat } from './statisticService.js'

export type MessageChatType = MessageChat
export type EnvChatType = EnvChat
export type WhiteListChatType = WhiteListChat
export type GroupNoticeChatType = GroupNoticeChat
export type RoomChatType = RoomChat
export type ContactChatType = ContactChat
export type ActivityChatType = ActivityChat
export type KeywordChatType = KeywordChat
export type NoticeChatType = NoticeChat
export type QaChatType = QaChat
export type LarkChatType = LarkChat
export type OrderChatType = OrderChat
export type StatisticChatType = StatisticChat

export {
  MessageChat,
  EnvChat,
  WhiteListChat,
  GroupNoticeChat,
  RoomChat,
  ContactChat,
  ActivityChat,
  KeywordChat,
  NoticeChat,
  QaChat,
  LarkChat,
  OrderChat,
  StatisticChat,
}
export type { WhiteList }

export interface Services {
  [key: string]: any;  // 索引签名
  messageService: MessageChat;
  whiteListService: WhiteListChat;
  groupNoticeService: GroupNoticeChat;
  roomService: RoomChat;
  contactService: ContactChat;
  activityService: ActivityChat;
  noticeService: NoticeChat;
  qaService: QaChat;
  keywordService: KeywordChat;
}
