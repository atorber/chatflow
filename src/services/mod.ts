import { MessageChat } from './messageService.js'
import { EnvChat } from './envService.js'
import { WhiteListChat } from './whiteListService.js'
import { GroupNoticeChat } from './groupNoticeService.js'
import { RoomChat } from './roomService.js'
import { ContactChat } from './contactService.js'
import { ActivityChat } from './activityService.js'
import { KeywordChat } from './keywordService.js'
import { NoticeChat } from './noticeService.js'
import { QaChat } from './qaService.js'

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
}
