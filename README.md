<!-- markdownlint-disable MD013 MD033 -->
# ChatFlow

<img alt="GitHub stars badge" src="https://img.shields.io/github/stars/atorber/chatflow"> <img alt="GitHub forks badge" src="https://img.shields.io/github/forks/atorber/chatflow"> <img alt="GitHub license badge" src="https://img.shields.io/github/license/atorber/chatflow">

wechat-qa-bot 更名为ChatFlow，[访问项目语雀文档了解更多信息](https://www.yuque.com/atorber/chatflow)

> 最新版本2.0.25是相对稳定的版本，数据表与之前版本不兼容，在运行时建议配置全新的维格表空间或删除原空间全部表

## 简介

ChatFlow是一个聊天机器人管理系统，可以帮助你实现一些原生IM无法支持的功能。

如果你是一个社群工作者、拼团团长、业务群运营经理，使用这个项目可以帮助你解决一些实际工作中的问题。

此外还提供定时任务、消息存档等功能。

基于开源项目Wechaty实现，目前主要验证了对微信的支持，理论上支持微信、钉钉、飞书、whatsapp等。

已适配网页版微信，linux、mac、Windows均可免费运行。

### 功能列表

[详细功能查看](https://www.yuque.com/atorber/oegota/aialc7sbyb4ldmg4/edit)

|功能|描述|
|--|--|
|群发通知|向群或好友批量下发消息|
|消息存档|群聊天消息存档到表格（基于vika维格表，免费），可以在维格表中对聊天消息进行进一步统计、筛选、分析等|
|定时提醒|定时消息发送，支持单次定时和周期消息发送给指定好友或群|
|活动报名|群内接龙报名，使用 报名/取消 指令统计活动报名|
|智能问答|可以自定义问答内容，智能匹配答案，支持相似问题匹配，例如“什么时候到货？”“亲，几时到货”“亲，什么时候到货”均能匹配（基于微信对话开放平台，免费）|
|白名单|支持配置群白名单，白名单内群开启机器人问答/活动报名，未配置问题答案的群不会受到机器人干扰|
|MQTT消息推送|支持配置一个MQTTQ消息队列，将消息推送到队列当中|
|远程控制发消息|支持通过MQTT控制机器人向指定好友或群发消息|

## 快速开始

[手把手教程](https://www.yuque.com/atorber/oegota/zm4ulnwnqp9whmd6)

1.下载源码并安装依赖

```Shell
git clone <https://github.com/atorber/chatflow.git>
cd ./chatflow
npm install
```

2.分别登陆[微信对话开放平台](https://openai.weixin.qq.com/)和[vika维格表](https://spcp52tvpjhxm.com.vika.cn/?inviteCode=55152973)官网注册账号并获取token

3.重命名.env.example文件为.env并修改配置文件

> 快速开始仅需要修改VIKA_TOKEN、VIKA_SPACE_NAME、ADMINROOM_ADMINROOMTOPIC配置项,其他配置项暂时无需修改，使用微信对话开放平台时配置WXOPENAI_TOKEN、WXOPENAI_ENCODINGAESKEY

```.env
# 维格表配置
VIKA_SPACE_NAME="" # 维格表空间名称，注意是名称而不是ID
VIKA_TOKEN="" #维格表token

# 基础配置
ADMINROOM_ADMINROOMTOPIC="瓦力是群主" # 管理群名称，需尽量保持名称复杂，避免重名群干扰

# 智能问答配置
WXOPENAI_TOKEN="" # 微信对话开放平台中获取
WXOPENAI_ENCODINGAESKEY="" # 微信对话开放平台中获取
```

4.启动程序

```Shell
npm run start
```

出现二维码之后，扫码二维码登陆微信

5.开启智能问答功能

5.1 设置微信对话平台token，填写"环境变量"表中的 【对话平台token】、【对话平台EncodingAESKey】并在"功能开关"表中开启智能问答

添加一个简单问题到微信对话开放平台，测试对应群内智能问答内容

5.2 如果不希望每个群都开启智能问答，需设置群白名单,首先需要将上图中的群白名单开关设置为开启

然后将群加入到问答白名单，在“群白名单”表中，加入需要开启的群ID（roomid）

群ID在消息中查看(在群里发一条消息，然后控制台查看或在维格表中查找)

详细操作参考 [手把手教程](https://www.yuque.com/atorber/oegota/zm4ulnwnqp9whmd6)

5.3 重启程序，在指定群测试问答

## 在Docker中部署运行

注意，因为wechaty-puppet-xp必须依赖Windows微信客户端，所以不能使用Docker，但使用wechaty-puppet-padlocal、wechaty-puppet-service则可以用Doker来部署，

最新代码已经默认wechaty-puppet-wehcat为初始化puppet，mac、linux系统直接拉取镜像即可运行（mac M1需要自行打包镜像）

### Wechaty-Puppet支持

|puppet名称|支持平台 |需要token |付费| 备注|
|--|--|--|--|--|
|wechaty-puppet-wechat| Windows、Linux、macOS |否| 否 |网页版wechat，无法获取真实的微信ID和群ID，重启之后ID可能会变|
|wechaty-puppet-xp|Windows| 否| 否 |仅支持windows|
|wechaty-puppet-padlocal👍| Windows、Linux、macOS| 是 |是 |
|wechaty-puppet-service👍| Windows、Linux、macOS| 是 |是 |企业微信|

> 特别注意，Wechaty-Puppet是wechaty的概念，本项目不涉及机器人开发，只是使用wechaty项目进行业务功能实现，什么是[Wechaty](https://wechaty.js.org/)请点击链接进行了解学习

### 拉取和运行

- 最新版本

```Shell
docker run -d --restart=always 
--env VIKA_TOKEN="维格表token" 
--env VIKA_SPACE_NAME="维格表空间名称" 
--env ADMINROOM_ADMINROOMTOPIC="超哥是群主" 
atorber/chatflow:latest
```

## 视频演示及使用教程

到项目官网 [查看视频教程](https://qabot.vlist.cc/)

## 常见问题及解决方案

1. 加入QQ群 583830241 在线交流，添加 ledongmao 微信

2. 到 [项目语雀知识库](https://www.yuque.com/atorber/oegota/ibnui5v8mob11d70) 查看常用问题

3. 提交一个issues <https://github.com/atorber/chatflow/issues>

## 效果展示

去 [效果展示图文](https://www.yuque.com/atorber/oegota/tbsokg3pqu5vk50y) 查看

## 二次开发

此项目只是提供了一个简单的使用微信机器人和智能对话平台实现的QA系统。如果有兴趣，可以继续学习微信对话开放平台的高级技能，实现诸如连续问答等高级功能，欢迎贡献你的创意。

此外要说明的是，项目中使用puppet-xp完全是出于免费的考虑，如果不考虑这一点的话，wechaty还有更好用的puppet，对于有能力的开发者来说可以根据实际情况替换。

### TODO LIST

- 消息群发，通知消息同时发布到多个群

- 消息转发，按设定规则转发消息

- 使用VIKA托管配置文件

### 相关依赖

项目用到了一些免费且好用的开源项目和平台

> 如果你是团长可忽略此段内容，开发者可进一步了解

- [Wechaty](https://wechaty.js.org/)

  只需几行代码，您就可以拥有一个功能齐全的聊天机器人

- [wechaty-puppet-xp](https://github.com/wechaty/puppet-xp)

  可能是目前最好用的免费wechat机器人

- [wechaty-puppet-wechat](https://github.com/wechaty/puppet-wechat)
  
  目前最简单的免费wechat机器人

- [微信对话开放平台](https://openai.weixin.qq.com/)

  5分钟零基础免费一键搭建智能对话机器人，并应用于微信公众号、小程序、企业网站、APP等

- [vika维格表](https://spcp52tvpjhxm.com.vika.cn/?inviteCode=55152973)

  将过去复杂的IT数据库技术，做得像表格一样简单(如果要注册，通过这个链接，或者使用邀请码 55152973 )

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=atorber/chatflow&type=Date)](https://star-history.com/#atorber/chatflow&Date)
