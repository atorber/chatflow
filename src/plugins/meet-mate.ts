#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
// 导入Wechaty相关模块
import {
    Contact,
    Message,
    Room,
    ScanStatus,
    WechatyBuilder,
    log,
  } from 'wechaty'

import qrcodeTerminal from 'qrcode-terminal'

  // 导入语雀相关模块
  import Yuque from '@yuque/sdk'

// 创建一个语雀客户端对象，使用环境变量中的token和repoId（需要提前设置）
  const yuqueClient = new Yuque({
    token:process.env.YUQUE_TOKEN
})
  const repoId = process.env.YUQUE_REPO_ID
  
  // 创建一个Wechaty实例
  const bot = WechatyBuilder.build({
    name: 'meeting-bot',
  })

  let meetings = {}

  type Meeting = {
    isMeeting:boolean
    meetingLog:string
    title:string
    room:Room
  }
  
  // 定义一个函数处理扫码登录事件
  function onScan (qrcode: string, status: ScanStatus) {
    if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
      const qrcodeImageUrl = [
        'https://wechaty.js.org/qrcode/',
        encodeURIComponent(qrcode),
      ].join('')
  
      log.info('MeetingBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)
  
      // 在终端显示二维码图片
      qrcodeTerminal.generate(qrcode, { small: true })
    } else {
      log.info('MeetingBot', 'onScan: %s(%s)', ScanStatus[status], status)
    }
  }
  
  // 定义一个函数处理登录事件
  function onLogin (user: Contact) {
    log.info('MeetingBot', '%s login', user)
  }
  
  // 定义一个函数处理登出事件
  function onLogout (user: Contact) {
    log.info('MeetingBot', '%s logout', user)
  }
  
  // 定义一个异步函数处理消息事件
  async function onMessage (msg: Message) {
    
    // 获取消息发送者和内容
    const sender = msg.talker()
    const text = msg.text()
    console.debug(text)

    
     // 如果消息来自群聊，并且内容是 #开会 ，则开始记录会议信息，并回复“开始记录”
     if (msg.room() && msg.room()!==undefined && text === '#开会') {

      // 判断当前群是否在会议中
      const meetingRoom = msg.room()
      if(meetingRoom){
        if(meetings[meetingRoom.id]&&meetings[meetingRoom.id].isMeeting){
          // 回复“已经在会议中”
          await msg.say('会议进行中')
        }else{
                // 设置当前状态为在会议中，并保存当前群聊对象和时间戳为会议标题
         const time = new Date().toLocaleString()
         const meetingLog = `## 开始时间\n ${time}\n\n## 内容记录\n`
  
          let meeting:Meeting = {
            isMeeting:true,
            room:meetingRoom,
            title:await meetingRoom.topic() + '-' + time,
            meetingLog
          }

          meetings[meetingRoom.id] = meeting

                 // 回复“开始记录”
         await msg.say('开始记录')
        }
      }
  
     }
  
     // 如果消息来自群聊，并且内容是 #结束 ，则结束记录会议信息，并回复“结束记录”
     if (msg.room() && msg.room()!==undefined && text === '#结束') {
  
       // 设置当前状态为不在会议中，并清空当前群聊对象和时间戳为会议标题
      const meetingRoom = msg.room()
      if(meetingRoom){
        if(meetings[meetingRoom.id]&&meetings[meetingRoom.id].isMeeting){
                // 设置当前状态为在会议中，并保存当前群聊对象和时间戳为会议标题
                 meetings[meetingRoom.id].isMeeting = false
    
         // 回复“结束记录”
         await msg.say('结束记录')
        }else{

                   // 回复“未在会议中，发送 #开会 开始会议”
                   await msg.say('未在会议中，发送 #开会 开始会议')
        }
      }

     }
  
     // 如果消息来自群聊，并且内容是 #会议纪要 ，则导出会议期间的聊天记录到语雀文档中，并回复文档链接或错误信息。
     if (msg.room() && msg.room()!==undefined && text === '#会议纪要') {

            
            const meetingRoom = msg.room()
            if(meetingRoom){
              // 判断当前群是否在会议中
              if(meetings[meetingRoom.id]&&meetings[meetingRoom.id].isMeeting){
                // 回复“已经在会议中”
                await msg.say('先发送 #结束 结束会议之后再导出会议纪要')
              }else if(!meetings[meetingRoom.id]){
                // 回复“没有可导出的会议纪要”
                await msg.say('没有可导出的会议纪要')
              }else{
                      // 导出会议纪要
                      const meeting = meetings[meetingRoom.id]
                      const slug = `unittest_create_${Date.now()}`
                      const data = {
                        body: meeting.meetingLog,
                        public: 1,
                        slug:slug,
                        title:meeting.title,
                      }
                        
                              try {
                        
                                // 调用语雀API创建一
                      // 调用语雀API创建一个文档，使用会议标题和聊天记录作为参数
                      
                      const doc = await yuqueClient.docs.create({
                          namespace: repoId,
                          data:data ,
                        })
                      
                        console.debug(doc)
                      
                        // 获取文档的链接地址，并回复给群聊
                        const docUrl = `https://www.yuque.com/${repoId}/${doc.slug}`
                        await msg.say(`会议纪要已导出到语雀文档：${docUrl}`)
                        delete meetings[meetingRoom.id]
                      
                      } catch (err) {
                      
                        // 如果出现错误，打印错误信息，并回复给群聊
                        log.error('MeetingBot', err)
                        await msg.say(`导出会议纪要失败，请重试~`)
                      }
              }
            }

}

// 如果消息来自群聊，并且当前状态是在会议中，则将消息内容追加到聊天记录中
if (msg.room() && msg.room()!==undefined) {
  const meetingRoom = msg.room()
  
  if(meetingRoom&&meetings[meetingRoom.id]&&meetings[meetingRoom.id].isMeeting){
let meeting = meetings[meetingRoom.id]
// 获取消息发送者的昵称和内容，拼接成一行记录，并追加到聊天记录中
const name = sender ? sender.name() : '未知用户'
const line = `- ${new Date().toLocaleString()} ${name}: ${text}\n`
meeting.meetingLog += line
  }

}
}

// 绑定事件处理函数到Wechaty实例上
bot.on('scan', onScan)
bot.on('login', onLogin)
bot.on('logout', onLogout)
bot.on('message', onMessage)

// 启动Wechaty实例
bot.start()
.then(() => log.info('MeetingBot', 'Meeting Bot Started.'))
.catch(e => log.error('MeetingBot', e))