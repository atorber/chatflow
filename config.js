/* eslint-disable sort-keys */
// 配置文件，所有配置必须齐全，补充空白配置项，其他配置项可按需要修改
const configs = {
  AT_AHEAD:true, // 只有机器人被@时回复
  WX_OPENAI_ONOFF:true, // 微信对话平台开启
  DIFF_REPLY_ONOFF:false, // 开启不同群个性化回复
  VIKA_ONOFF:true, // 维格表开启
  WX_TOKEN: 'xxxxxxx', // 微信对话平台token
  VIKA_TOKEN: 'xxxxxxx', // VIKA维格表token
  VIKA_SPACENAME:'xxxxxxx',  // VIKA维格表空间名称，修改为自己的空间名称
  VIKA_DATASHEETNAME:'xxxxxxx', // VIKA维格表名称,可以修改为自己的表名称
  linkWhiteList: ['ledongmao', 'xxxxxxx'],  // 群内链接检测白名单，白名单里成员发布的卡片、链接消息不提示
  welcomeList:['25108313781@chatroom', '25187527247@chatroom', '20641535286@chatroom'],
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
  imConfigData: {
    socket: '',
    chatInfoEn: {
      chatState: 'agent', // chat状态；robot 机器人、agent 客服
      inputContent: '', // 输入框内容
      msgList: [], // 消息列表
      state: 'on', // 连接状态;on ：在线；off：离线
      lastMsgShowTime: new Date(), // 最后一个消息的显示时间
    }, // 会话信息，包括聊天记录、状态
    clientChatEn: {
      clientChatId: 'ledongmao',
      clientChatName: '客服机器人',
      avatarUrl: 'static/image/im_client_avatar.png',
    }, // 当前账号的信息
    serverChatEn: {
      serverChatId: 'xiaop',
      serverChatName: '小P',
      avatarUrl: 'static/image/im_robot_avatar.png',
    }, // 服务端chat信息
    robotEn: {
      robotName: '小旺',
      avatarUrl: 'static/image/im_robot_avatar.png',
    }, // 机器人信息
    faqList: [
      { title: '今天周几', content: '今天周一' },
      { title: '今天周几', content: '今天周二' },
      { title: '今天周几', content: '今天周三' },
      { title: '今天周几', content: '今天周四' },
      { title: '今天周几', content: '今天周五' },
    ],
    faqSelected: '-1',
    inputContent_setTimeout: null, // 输入文字时在输入结束才修改具体内容
    selectionRange: null, // 输入框选中的区域
    shortcutMsgList: [], // 聊天区域的快捷回复列表
    logoutDialogVisible: false, // 结束会话显示
    transferDialogVisible: false, // 转接人工dialog
    rateDialogVisible: false, // 评价dialog
    leaveDialogVisible: false, // 留言dialog
  },
  noderedOpen: false,  // 是否开启nodered，开启nodered后可以以可视化界面启动机器人，需要先导入 ./tools 目录下的 flows.json
}

export default configs
