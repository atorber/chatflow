
import { Message, log } from 'wechaty'
import axios from 'axios'

// 获取格式化后的顺风车信息
async function getFormattedRideInfo (message:Message) {
  let text: string = message.text()
  const name:string = message.talker().name()
  const apiUrl = 'https://openai.api2d.net/v1/chat/completions'
  const headers = {
    Authorization: 'Bearer xxxx', // <-- 把 fkxxxxx 替换成你自己的 Forward Key，注意前面的 Bearer 要保留，并且和 Key 中间有一个空格。
    'Content-Type': 'application/json',
  }
  text = `从"发布人：${name}\n信息：${text}"中提取出:类型（人找车、车找人）、出发地、目的地、出发日期、出发时间、联系电话、发布人、车费、途经路线,不要输出任何其他的描述`
  const payload = {
    messages: [ { content: text, role: 'user' } ],
    model: 'gpt-3.5-turbo',
  }

  try {
    const response = await axios.post(apiUrl, payload, { headers })
    log.info('顺风车信息检测结果：', JSON.stringify(response.data))
    return response.data
  } catch (error) {
    console.error(error)
    return  undefined
  }
}

export { getFormattedRideInfo }
