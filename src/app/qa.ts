/* eslint-disable no-console */
import AppBase from '../types/app-base.js'
import { Message, log, Room } from 'wechaty'
import { ChatFlowConfig } from '../api/base-config.js'
import { containsContact, containsRoom } from '../services/userService.js'
import {
  wxai,
  gpt,
} from '../plugins/mod.js'

async function handleAutoQAForContact (message: Message, keyWord: string) {
  const talker = message.talker()
  const text = message.text()
  log.info('联系人请求智能问答：', (text === keyWord))
  if (ChatFlowConfig.configEnv.AUTOQA_AUTOREPLY) {
    const isInContactWhiteList = await containsContact(ChatFlowConfig.whiteList.contactWhiteList.qa, talker)
    if (isInContactWhiteList) {
      log.info('当前好友在qa白名单内，请求问答...')
      try {
        await wxai(ChatFlowConfig.configEnv, ChatFlowConfig.bot, message)
      } catch (e) {
        log.error('发起请求wxai失败', talker.name(), e)
      }
    } else {
      log.info('当前好友不在qa白名单内，流程结束')
    }
    const isInGptContactWhiteList = await containsContact(ChatFlowConfig.whiteList.contactWhiteList.gpt, talker)
    if (isInGptContactWhiteList) {
      log.info('当前好友在qa白名单内，请求问答gpt...')
      try {
        await gpt(ChatFlowConfig.configEnv, ChatFlowConfig.bot, message)
      } catch (e) {
        log.error('发起请求wxai失败', talker.name(), e)
      }
    } else {
      log.info('当前好友不在gpt白名单内，gpt流程结束')
    }
  }
}

async function handleAutoQA (message: Message, keyWord: string) {
  const room = message.room() as Room
  const topic = await room.topic()
  const text = message.text()
  log.info('群消息请求智能问答：' + JSON.stringify(text === keyWord))
  if (ChatFlowConfig.configEnv.AUTOQA_AUTOREPLY) {
    const isInRoomWhiteList = await containsRoom(ChatFlowConfig.whiteList.roomWhiteList.qa, room)
    if (isInRoomWhiteList) {
      log.info('当前群在qa白名单内，请求问答...')
      try {
        await wxai(ChatFlowConfig.configEnv, ChatFlowConfig.bot, message)
      } catch (e) {
        log.error('发起请求wxai失败', topic, e)
      }
    }

    const isInGptRoomWhiteList = await containsRoom(ChatFlowConfig.whiteList.roomWhiteList.gpt, room)
    if (isInGptRoomWhiteList) {
      log.info('当前群在qa白名单内，请求问答gpt...')
      try {
        await gpt(ChatFlowConfig.configEnv, ChatFlowConfig.bot, message)
      } catch (e) {
        log.error('发起请求gpt失败', topic, e)
      }
    }
  }
}

export const qa = async (message: Message) => {
  const room = message.room()
  const keyWord = ChatFlowConfig.bot.currentUser.name()
  const isSelf = message.self()

  // 群消息处理
  if (room && room.id && !isSelf) {
    await handleAutoQA(message, keyWord)
  }

  // 非群消息处理
  if ((!room || !room.id) && !isSelf) {
    await handleAutoQAForContact(message, keyWord)
  }

}

class EventRegistrationApp extends AppBase {

  private registrations: string[] = []

  public registerUser (name: string): void {
    if (!AppBase.serviceEnabled) {
      console.log('Event registration is currently disabled.')
      return
    }

    if (AppBase.whitelist.includes(name)) {
      this.registrations.push(name)
      console.log(`User ${name} successfully registered.`)
    } else {
      console.log(`User ${name} is not allowed to register.`)
    }
  }

  public showRegistrations (): void {
    console.log('Current registrations:')
    this.registrations.forEach((name, index) => {
      console.log(`${index + 1}. ${name}`)
    })
  }

}

export default EventRegistrationApp
