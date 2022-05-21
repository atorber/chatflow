/* eslint-disable sort-keys */
// 配置文件，所有配置必须齐全，补充空白配置项，其他配置项可按需要修改
const configs = {
  WX_TOKEN: '', // 微信对话平台token
  VIKA_TOKEN: '', // VIKA维格表token
  VIKA_SPACENAME:'智慧社区管理平台',  // VIKA维格表空间名称，修改为自己的空间名称
  VIKA_DATASHEETNAME:'qa-bot', // VIKA维格表名称,可以修改为自己的表名称
  linkWhiteList: ['ledongmao', 'abcd'],  // 群内链接检测白名单，白名单里成员发布的卡片、链接消息不提示
  roomWhiteList: [
    {
      name: 'xxxx',
      id: '22064763@chatroom',
    }, {
      name: 'xxxx',
      id: '22064763@chatroom',
    }, {
      name: 'xxxx',
      id: '22064763@chatroom',
    },
  ],  // 群白名单，白名单里内群开启机器人，其他群不开启，暂未实现2022-5-21
  imOpen: false,  // 是否开启uve-im客户端，设置为true时，需要先 cd ./vue-im 然后 npm install 启动服务 npm run dev
  noderedOpen: false,  // 是否开启nodered，开启nodered后可以以可视化界面启动机器人，需要先导入 ./tools 目录下的 flows.json
}

export default configs
