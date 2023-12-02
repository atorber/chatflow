import { logger, delay } from '../utils/mod.js'
import {
  MessageChat,
  EnvChat,
  WhiteListChat,
  GroupNoticeChat,
  RoomChat,
  ContactChat,
  ActivityChat,
  NoticeChat,
  QaChat,
  KeywordChat,
  LarkChat,
} from '../services/mod.js'
import { ChatFlowConfig } from '../chatflow.js'

export const initializeServicesAndEnv = async () => {
  logger.info('初始化服务开始...')
  await EnvChat.init()
  await delay(500)
  if (ChatFlowConfig.dataBaseType === 'lark') {
    await LarkChat.init()
    await delay(500)
  } else {
    await MessageChat.init()
    await delay(500)
  }
  await ActivityChat.init()
  await delay(500)
  await ContactChat.init()
  await delay(500)
  await GroupNoticeChat.init()
  await delay(500)
  await KeywordChat.init()
  await delay(500)
  await NoticeChat.init()
  await delay(500)
  await RoomChat.init()
  await delay(500)
  await WhiteListChat.init()
  await delay(500)
  await QaChat.init()
  // logger.info('services:' + JSON.stringify(services))
}
