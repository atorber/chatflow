import { Message, log } from 'wechaty'
import axios from 'axios'
import { ChatFlowCore } from '../api/base-config.js'

export interface CarpoolInfoChinese {
  /**
   * 类型（人找车、车找人）
   */
  '类型（人找车、车找人）': '人找车' | '车找人';
  /**
   * 出发地
   */
  出发地: string;
  /**
   * 目的地
   */
  目的地: string;
  /**
   * 出发日期
   */
  出发日期: string;
  /**
   * 出发时间
   */
  出发时间: string;
  /**
   * 联系电话
   */
  联系电话: string;
  /**
   * 发布人
   */
  发布人: string;
  /**
   * 车费
   */
  车费: string;
  /**
   * 途经路线
   */
  途经路线: string;
    /**
   * 原始消息
   */
  原始消息: string;
      /**
   * 状态
   */
  状态: '开启'|'关闭';
}

export interface CarpoolInfo {
  /**
   * Type (车找人, 人找车)
   */
  type: '车找人' | '人找车';
  /**
   * Departure location
   */
  departureLocation: string;
  /**
   * Destination
   */
  destination: string;
  /**
   * Departure date
   */
  departureDate: string;
  /**
   * Departure time
   */
  departureTime: string;
  /**
   * Contact phone
   */
  contactPhone: string;
  /**
   * Publisher
   */
  publisher: string;
  /**
   * Car fee
   */
  carFee: string;
  /**
   * Route
   */
  route: string;
    /**
   * Text
   */
  text: string;
    /**
   * state
   */
  topic: string;
  roomId: string;
  wxid: string;
  createdAt: string;
  state: '开启'|'关闭';
}

// 获取格式化后的顺风车信息
async function getFormattedRideInfo (message:Message) {
  const text: string = message.text()
  const room = message.room()
  const talker = message.talker()
  const name:string = message.talker().name()
  const apiUrl = `${ChatFlowCore.configEnv.CHATGPT_ENDPOINT}/v1/chat/completions`
  const headers = {
    Authorization: `Bearer ${ChatFlowCore.configEnv.CHATGPT_KEY}`, // <-- 把 fkxxxxx 替换成你自己的 Forward Key，注意前面的 Bearer 要保留，并且和 Key 中间有一个空格。
    'Content-Type': 'application/json',
  }
  const content = `从"发布人：${name}\n信息：${text}"中提取出顺风车信息，提取不到的内容填写“暂无”:
{
  "类型（人找车、车找人）":"",
  "出发地"："",
  "目的地"："",
  "出发日期":"",
  "出发时间":"":
  "联系电话":"",
  "发布人":"",
  "车费":"",
  "途经路线":""
}`
  const payload = {
    messages: [ { content, role: 'user' } ],
    model: ChatFlowCore.configEnv.CHATGPT_MODEL, // 'gpt-3.5-turbo
  }

  try {
    const response = await axios.post(apiUrl, payload, { headers })
    log.info('顺风车信息检测结果：', JSON.stringify(response.data))
    const rideInfo = response.data
    const content = rideInfo.choices[0].message.content
    //  先去除content中的换行符，再取出{}之间的字符串（包含{}）
    const contentStr = content.replace(/[\r\n]/g, '').match(/{.*}/)
    log.info('contentStr信息:', contentStr)
    try {
      // 对contentStr进行JSON.parse，如果失败则说明contentStr不是json格式
      const rideInfoObj = JSON.parse(contentStr) as CarpoolInfoChinese
      log.info('rideInfoObj信息:', JSON.stringify(rideInfoObj, null, 2))
      const rideInfoObjFormatted: CarpoolInfo = {
        type: rideInfoObj['类型（人找车、车找人）'],
        departureLocation: rideInfoObj.出发地,
        destination: rideInfoObj.目的地,
        departureDate: rideInfoObj.出发日期,
        departureTime: rideInfoObj.出发时间,
        contactPhone: rideInfoObj.联系电话,
        publisher: rideInfoObj.发布人,
        carFee: rideInfoObj.车费,
        route: rideInfoObj.途经路线,
        text,
        topic: await room?.topic() || '',
        roomId: room?.id || '',
        wxid: talker.id,
        createdAt: new Date().toLocaleString(),
        state: '开启',
      }
      return rideInfoObjFormatted
    } catch (error) {
      log.error('rideInfoObj信息解析失败，不是JSON格式:', error)
      throw new Error('rideInfoObj信息解析失败，不JSON格式')
    }
  } catch (error) {
    log.error('顺风车信息检测失败:', error)
    throw new Error('顺风车信息检测失败...')
  }
}

export { getFormattedRideInfo }
