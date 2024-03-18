/* eslint-disable no-console */
// 实现一个类，请求登录接口获得token，自动更新token、当token过期时自动重新请求token
// import axios, { AxiosInstance } from 'axios'
import getAuthClient from '../src/utils/auth.js'
import 'dotenv/config.js'  // 导入环境变量配置

// import {
//   ServeGetUserConfig,
//   ServeGetUserDetail,
//   ServeGetUserSetting,
//   ServeGetUserConfigBykey,
//   ServeGetUserConfigGroup,
// } from '../src/api/user.js'

// import { ServeGetWhitelistWhite } from '../src/api/white-list.js'
// import { ServeGetNotices } from '../src/api/notice.js'
// import { ServeGetKeywords } from '../src/api/keyword.js'
// import { ServeGetStatistics } from '../src/api/statistic.js'
// import { ServeGetGroupnotices } from '../src/api/group-notice.js'

// import {
//   ServeGetChatbots,
//   ServeGetChatbotUsers,
//   ServeGetChatbotUsersGroup,
//   ServeGetChatbotUsersDetail,
// } from '../src/api/chatbot.js'

// import { ServeGetNoticesTask } from '../src/api/notice.js'
// import { ServeGetWelcomes } from '../src/api/welcome.js'
// import { ServeGetQas } from '../src/api/qa.js'

// import { ServeGetMedias } from '../src/api/media.js'

const main = async () => {
  const authClient = getAuthClient()
  const res = await authClient.init(process.env.VIKA_SPACE_ID, process.env.VIKA_TOKEN)
  console.log('res:', JSON.stringify(res.data, null, 2))
  await authClient.login()
  // const task = await ServeGetNoticesTask()
  // console.log('task:', JSON.stringify(task, null, 2))

  // const chatbots = await ServeGetChatbots()
  // console.log('chatbots:', JSON.stringify(chatbots, null, 2))

  // const chatbotUsers = await ServeGetChatbotUsers({ id:1 })
  // console.log('chatbotUsers:', JSON.stringify(chatbotUsers, null, 2))

  // const chatbotUsersGroup = await ServeGetChatbotUsersGroup()
  // console.log('chatbotUsersGroup:', JSON.stringify(chatbotUsersGroup, null, 2))

  // const chatbotUsersDetail = await ServeGetChatbotUsersDetail()
  // console.log('chatbotUsersDetail:', JSON.stringify(chatbotUsersDetail, null, 2))

  // const welcomes = await ServeGetWelcomes()
  // console.log('welcomes:', JSON.stringify(welcomes, null, 2))

  // const qas = await ServeGetQas()
  // console.log('qas:', JSON.stringify(qas, null, 2))

  // const userInfo = await ServeGetUserDetail()
  // console.log('userInfo:', userInfo)

  // const userSetting = await ServeGetUserSetting()
  // console.log('userSetting:', userSetting)

  // const userConfig = await ServeGetUserConfigBykey({ key:'BASE_BOT_NAME', value:'config333' })
  // console.log('userConfig:', userConfig)

  // const userConfigGroup = await ServeGetUserConfigGroup()
  // console.log('userConfigGroup:', JSON.stringify(userConfigGroup))

  // const whiteList = await ServeGetWhitelistWhite()
  // console.log('whiteList:', JSON.stringify(whiteList))

  // const jobs = await ServeGetNotices()
  // console.log('jobs:', JSON.stringify(jobs))

  // const keywords = await ServeGetKeywords()
  // console.log('keywords:', JSON.stringify(keywords))

  // const statistics = await ServeGetStatistics()
  // console.log('statistics:', JSON.stringify(statistics))

  // const groupnotices = await ServeGetGroupnotices()
  // console.log('groupnotices:', JSON.stringify(groupnotices))

  // const userConfigGroup = await ServeGetUserConfigGroup()
  // console.log('userConfigGroup:', JSON.stringify(userConfigGroup))

  // const medias = await ServeGetMedias({ name:'程序开发' })
  // console.log('medias:', JSON.stringify(medias, null, 2))

  /* 链接检测 */
  // const text = 'https://oou2hscgt2.feishu.cn/base/bascnPgZURujrdwZ9T4JkLUSUQc?table=tbl90nnja6sqMuCT&view=vewmgp68n9'
  // const text = 'https://vika.cn/workbench/dstagAfWtNuTqHQizP/viw7KwjQyCjbP?spaceId=spcj6bgt12WoZ'

// const VIKA_BASE_STRING = 'https://vika.cn/workbench/'
// const LARK_BASE_STRING = '.feishu.cn/base/'
// if (text.includes(VIKA_BASE_STRING) || text.includes(LARK_BASE_STRING)) {
//   const config: {
//     spaceId: string | undefined,
//     table: string | undefined,
//     view: string | undefined,
//   } = { spaceId: '', table: '', view: '' }
//   const vikaConfig = text.match(/https:\/\/vika.cn\/workbench\/(.*?)\/(.*)\?spaceId=(.*)/)
//   console.info('vikaConfig:', vikaConfig)
//   const larkConfig = text.match(/.feishu.cn\/base\/(.*?)\?table=(.*)&view=(.*)/)
//   console.info('larkConfig:', larkConfig)
//   if (vikaConfig && vikaConfig.length === 4) {
//     config.spaceId = vikaConfig[3]
//     config.table = vikaConfig[1]
//     config.view = vikaConfig[2]
//   } else if (larkConfig && larkConfig.length === 4) {
//     config.spaceId = larkConfig[1]
//     config.table = larkConfig[2]
//     config.view = larkConfig[3]
//   }
//   console.info('多维表格配置信息：', JSON.stringify(config))
// }
}

void main()
