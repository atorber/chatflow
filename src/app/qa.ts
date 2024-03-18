/* eslint-disable no-console */
import AppBase from '../types/app-base.js'
import { Message, log, Room } from 'wechaty'
import { ChatFlowConfig } from '../api/base-config.js'
import { containsContact, containsRoom } from '../services/userService.js'
import {
  wxai,
  gpt,
} from '../plugins/mod.js'

// 回复好友消息
async function handleAutoQAForContact (message: Message, keyWord: string) {
  const talker = message.talker()
  const text = message.text()
  const includesKeyWord = text.indexOf(keyWord) !== -1
  log.info('消息中包含关键字：', includesKeyWord ? '是' : '否')
  const AUTOQA_AUTOREPLY = ChatFlowConfig.configEnv.AUTOQA_AUTOREPLY
  log.info('自动问答开关开启状态：', AUTOQA_AUTOREPLY ? '开启' : '关闭')

  // 问答开关开启，私聊中不需要@机器人
  if (AUTOQA_AUTOREPLY) {
    // 判断是否在微信对话平台白名单内
    const isInContactWhiteList = await containsContact(ChatFlowConfig.whiteList.contactWhiteList.qa, talker)
    if (isInContactWhiteList) {
      log.info('当前好友在【白名单|WhiteList/智能问答|qa】内，请求问答...')
      try {
        await wxai(ChatFlowConfig.configEnv, ChatFlowConfig.bot, message)
      } catch (e) {
        log.error('当前好友在【白名单|WhiteList/智能问答|qa】内，发起请求wxai失败', e)
      }
    } else {
      log.info('当前好友不在【白名单|WhiteList/智能问答|qa】内，流程结束')
    }

    // 判断是否在gpt白名单内
    const isInGptContactWhiteList = await containsContact(ChatFlowConfig.whiteList.contactWhiteList.gpt, talker)
    if (isInGptContactWhiteList) {
      log.info('当前好友在【白名单|WhiteList/ChatGPT|gpt】内，请求问答gpt...')
      try {
        await gpt(ChatFlowConfig.bot, message)
      } catch (e) {
        log.error('当前好友不在【白名单|WhiteList/ChatGPT|gpt】内，发起请求gpt失败', e)
      }
    } else {
      log.info('当前好友不在【白名单|WhiteList/ChatGPT|gpt】内，gpt流程结束')
    }
  }
}

// 回复群消息
async function handleAutoQA (message: Message, keyWord: string) {
  const room = message.room() as Room
  const topic = await room.topic()
  const text = message.text()
  const includesKeyWord = text.indexOf(keyWord) !== -1
  log.info('消息中包含关键字：', includesKeyWord ? '是' : '否')
  const AUTOQA_AUTOREPLY = ChatFlowConfig.configEnv.AUTOQA_AUTOREPLY
  log.info('自动问答开关开启：', AUTOQA_AUTOREPLY ? '开启' : '关闭')

  // 问答开关开启，且消息中包含关键字
  if (AUTOQA_AUTOREPLY && includesKeyWord) {

    // 判断是否在微信对话平台白名单内
    const isInRoomWhiteList = await containsRoom(ChatFlowConfig.whiteList.roomWhiteList.qa, room)
    if (isInRoomWhiteList) {
      log.info('当前群在【白名单|WhiteList/智能问答|qa】内，请求问答...')
      try {
        await wxai(ChatFlowConfig.configEnv, ChatFlowConfig.bot, message)
      } catch (e) {
        log.error('当前群在【白名单|WhiteList/智能问答|qa】内，发起请求wxai失败', e)
      }
    }

    // 判断是否在gpt白名单内
    const isInGptRoomWhiteList = await containsRoom(ChatFlowConfig.whiteList.roomWhiteList.gpt, room)
    if (isInGptRoomWhiteList) {
      log.info('当前群在【白名单|WhiteList/ChatGPT|gpt】白名单内，请求问答gpt...')
      try {
        await gpt(ChatFlowConfig.bot, message)
      } catch (e) {
        log.error('当前群在【白名单|WhiteList/ChatGPT|gpt】白名单内，发起请求gpt失败', topic, e)
      }
    } else {
      log.info('当前群不在【白名单|WhiteList/ChatGPT|gpt】内，gpt流程结束')
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
