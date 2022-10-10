/* eslint-disable sort-keys */
// 配置文件，所有配置必须齐全，补充空白配置项，其他配置项可按需要修改
const configs = {
  // VIKA维格表token
  VIKA_TOKEN: '配置成自己的维格表token',
  // VIKA维格表空间名称，修改为自己的空间名称
  VIKA_SPACENAME: '智慧社区管理平台2',
  // 进群欢迎语白名单
  welcomeList: [
    '25108313781@chatroom',
    '25187527247@chatroom',
    '20641535286@chatroom',
  ],
  // 群白名单，白名单里内群开启机器人，其他群不开启，暂未实现2022-5-21
  roomWhiteList: [
    '25108313781@chatroom', // Easy Chatbot Show
    '5854608913@chatroom', // Moments
  ],
  // 群内链接检测白名单，白名单里成员发布的卡片、链接消息不提示
  linkWhiteList: [
    'ledongmao',
    'xxxxxxx',
  ],
}

export default configs
