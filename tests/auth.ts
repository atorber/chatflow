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

import {
  ServeGetChatbots,
  ServeGetChatbotUsers,
  ServeGetChatbotUsersGroup,
  ServeGetChatbotUsersDetail,
} from '../src/api/chatbot.js'

import { ServeGetNoticesTask } from '../src/api/notice.js'

const authClient = getAuthClient()
await authClient.login(process.env.VIKA_SPACE_ID, process.env.VIKA_TOKEN)

// const task = await ServeGetNoticesTask()
// console.log('task:', JSON.stringify(task, null, 2))

// const chatbots = await ServeGetChatbots()
// console.log('chatbots:', JSON.stringify(chatbots, null, 2))

// const chatbotUsers = await ServeGetChatbotUsers({ id:1 })
// console.log('chatbotUsers:', JSON.stringify(chatbotUsers, null, 2))

// const chatbotUsersGroup = await ServeGetChatbotUsersGroup()
// console.log('chatbotUsersGroup:', JSON.stringify(chatbotUsersGroup, null, 2))

const chatbotUsersDetail = await ServeGetChatbotUsersDetail()
console.log('chatbotUsersDetail:', JSON.stringify(chatbotUsersDetail, null, 2))

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
