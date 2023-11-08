import { ChatFlowConfig } from '../api/base-config.js'
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
  Services,
} from '../services/mod.js'

export const initializeServicesAndEnv = async () => {
  logger.info('初始化服务开始...')
  await EnvChat.init()
  await delay(1000)
  ChatFlowConfig.services = await initializeServices()
  // logger.info('services:' + JSON.stringify(services))
}

export const initializeServices = async () => {
  const services: Services = {} as Services
  const serviceClasses = [
    { service: MessageChat, variable: 'messageService' },
    { service: WhiteListChat, variable: 'whiteListService' },
    { service: GroupNoticeChat, variable: 'groupNoticeService' },
    { service: RoomChat, variable: 'roomService' },
    { service: ContactChat, variable: 'contactService' },
    { service: ActivityChat, variable: 'activityService' },
    { service: NoticeChat, variable: 'noticeService' },
    { service: QaChat, variable: 'qaService' },
    { service: KeywordChat, variable: 'keywordService' },
  ]

  for (const { service, variable } of serviceClasses) {
    const Service = service
    services[variable] = new Service()
    await delay(1000)
  }
  return services
}
