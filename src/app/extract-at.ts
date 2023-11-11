import { Message, log } from 'wechaty'
import {
  formatTimestamp,
} from '../utils/mod.js'
import {
  MessageChat,
} from '../services/mod.js'
import { handleSay } from '../handlers/onReadyOrLogin.js'
import {
  gptbot,
} from '../plugins/mod.js'
import { ChatFlowConfig } from '../api/base-config.js'

export const extractAtContent = async (message: Message): Promise<string | null> => {

  const text = message.text()
  const keyWord = ChatFlowConfig.bot.currentUser.name()

  // @机器人消息处理，当引用消息仅包含@机器人时，提取引用消息内容并回复
  if (text.indexOf(`@${keyWord}`) !== -1) {
    const startTag = '「'
    const endTag = '」\n'
    let newText = ''
    // 判断信息中是否是引用消息
    const startIndex = text.indexOf(startTag) + startTag.length
    const endIndex = text.indexOf(endTag, startIndex)

    // 提取「和 」之间的内容
    if (startIndex !== -1 && endIndex !== -1) {
      newText = `@${keyWord}` + text.substring(startIndex, endIndex)
      log.info('提取到的内容：', newText)
    } else {
      log.info('未提取到内容：', text)
      newText = text
    }

    const query = { 'room.payload.id': message.room()?.id }
    const messageList = await MessageChat.messageData
      .sort({ timestamp: -1 })
      .limit(0, 500)
      .find(query)

    log.info('查询到的messageList长度:', messageList.length)

    // TBD将消息转换为提示词
    const style = '详细、严谨、像真人一样表达'
    // const role = '电影《大话西游》里的唐三藏这个角色'
    const role = '智能助理'

    let p = `以下是一个群组的聊天记录，你将以“${keyWord}”的身份作为群聊中的一员参与聊天。你的回复必须结合聊天历史记录和你的知识给出尽可能${style}的回答，回复字数不超过150字，并且听起来语气口吻像${role}的风格。\n\n`

    const time = formatTimestamp(new Date().getTime())[5]
    let chatText = ''
    for (const i in messageList) {
      const item = messageList[i]
      if (chatText.length < 2000 && item.data.payload.type === 7) {
        chatText = `[${item.time || time} ${item.talker.payload.name}]:${item.data.payload.text}\n` + chatText
      } else { /* empty */ }
    }
    // chatText = chatText + `[${time} ${message.talker().name()}]：${newText}\n`
    // chatText = chatText + `[${time} ${keyWord}]：`

    p = p + chatText

    p = `微信群聊天记录:\n${chatText}\n\n指令:\n你是微信聊天群里的成员【${keyWord}】，你正在参与大家的群聊天，先在轮到你发言了，你的回复尽可能清晰、严谨，字数不超过150字，并且你需要使用${role}的风格回复。当前时间是${time}。`

    p = p + `\n\n最新的对话:\n[${time} ${message.talker().name()}]：${newText}\n[${time} ${keyWord}]：`
    log.info('提示词：', p)

    const answer = await gptbot(process.env, p)

    if (answer.text && answer.text.length > 0) {
      await handleSay(message, answer.text)
      // await message.say(answer.text)
    } else {
      await handleSay(message, `${keyWord}走神了，再问一次吧~`)
      // await message.say(`${keyWord}走神了，再问一次吧~`)
    }
    return null
  }

  return null
}
