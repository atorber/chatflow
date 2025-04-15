import { MessageChat } from './messageService.js'
import { EnvChat } from './envService.js'
import { WhiteListChat, WhiteList } from './whiteListService.js'
import { GroupNoticeChat } from './groupNoticeService.js'
import { ActivityChat } from './activityService.js'
import { NoticeChat } from './noticeService.js'
import { QaChat } from './qaService.js'
import { OrderChat } from './orderService.js'
import { StatisticChat } from './statisticService.js'

export type MessageChatType = MessageChat
export type EnvChatType = EnvChat
export type WhiteListChatType = WhiteListChat
export type GroupNoticeChatType = GroupNoticeChat
export type ActivityChatType = ActivityChat
export type NoticeChatType = NoticeChat
export type QaChatType = QaChat
export type OrderChatType = OrderChat
export type StatisticChatType = StatisticChat

export {
  MessageChat,
  EnvChat,
  WhiteListChat,
  GroupNoticeChat,
  ActivityChat,
  NoticeChat,
  QaChat,
  OrderChat,
  StatisticChat,
}
export type { WhiteList }

export interface Services {
  [key: string]: any;  // 索引签名
  messageService: MessageChat;
  whiteListService: WhiteListChat;
  groupNoticeService: GroupNoticeChat;
  activityService: ActivityChat;
  noticeService: NoticeChat;
  qaService: QaChat;
}
