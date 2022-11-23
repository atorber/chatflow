  // IM相关配置
  const configData = {
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
  }

export { configData }

export default configData