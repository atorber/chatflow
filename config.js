/* eslint-disable sort-keys */
// 配置文件，所有配置必须齐全，补充空白配置项，其他配置项可按需要修改

const WX_TOKEN = "" // 微信对话平台token
const VIKA_TOKEN = "" // VIKA维格表token
const VIKA_SPACENAME = "mp-chatbot"  // VIKA维格表空间名称
const VIKA_DATASHEETNAME = "qa-bot" // VIKA维格表名称
const linkWhiteList = ['ledongmao']  // 群内链接检测白名单，白名单里成员发布的卡片、链接消息不提示

const configs = {
  WX_TOKEN,
  VIKA_TOKEN,
  VIKA_DATASHEETNAME,
  VIKA_SPACENAME,
  linkWhiteList,
}

export default configs
