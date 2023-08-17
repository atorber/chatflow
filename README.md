# wechat-qa-bot

[访问项目语雀文档了解更多信息](https://www.yuque.com/atorber/oegota)

## 简介

本项目使用wechat机器人快速实现一个免费的QA问答系统，如果你是一个社群工作者、拼团团长、业务群运营经理，使用这个项目可以帮助你解决一些重复性问答。

同时，本项目也具备微信消息收集、定时通知等常用场景功能。

已适配网页版微信，linux、mac、Windows均可运行。

### 功能列表

[详细功能查看](https://www.yuque.com/atorber/oegota/aialc7sbyb4ldmg4/edit)

|功能|描述|
|--|--|
|消息存档|群聊天消息存档到表格（基于vika维格表，免费）|
|定时消息|定时消息发送，支持单次定时和周期消息发送给指定好友或群|
|智能问答|可以自定义问答内容，智能匹配答案，支持相似问题匹配，例如“什么时候到货？”“亲，几时到货”“亲，什么时候到货”均能匹配（基于微信对话开放平台，免费）|
|千群千面|多个群相同问题不同回答内容,例如“何时到货？”,A群中回答“今天到”，B群中回答“明天到货”|
|群白名单|支持配置群白名单，白名单内群开启机器人问答，未配置问题答案的群不会受到机器人干扰|
|客服后台|简单客服后台，可以把群内消息按发言人列表区分|
|MQTT消息推送|支持配置一个MQTTQ消息队列，将消息推送到队列当中|
|远程控制发消息|支持通过MQTT控制机器人向指定好友或群发消息|
|非群主链接检测|支持非群主小程序卡片、网页链接分享检测，自动提醒、警告发送者撤回|
|团购订单转换|支持快团团订货单转换，原始表发送到群即可自动转换为按楼栋统计表|

## 快速开始

[手把手教程](https://www.yuque.com/atorber/oegota/zm4ulnwnqp9whmd6)

1.下载源码并安装依赖

```Shell
git clone <https://github.com/choogoo/wechat-openai-qa-bot.git>
cd ./wechat-openai-qa-bot
npm install
```

2.分别登陆[微信对话开放平台](https://openai.weixin.qq.com/)和[vika维格表](https://spcp52tvpjhxm.com.vika.cn/?inviteCode=55152973)官网注册账号并获取token

3.重命名src/config.json.example文件为config.json修改./config.js配置文件

快速开始仅需要修改VIKA_TOKEN、VIKA_SPACE_NAME配置项,其他配置项暂时无需修改

```.env
# 维格表配置
VIKA_SPACE_NAME="" # 维格表空间名称，注意是名称而不是ID
VIKA_TOKEN="" #维格表token

# Wechaty配置
WECHATY_PUPPET="wechaty-puppet-wechat" # 可选值：wechaty-puppet-wechat4u、wechaty-puppet-wechat、wechaty-puppet-xp、wechaty-puppet-engine、wechaty-puppet-padlocal、wechaty-puppet-service
WECHATY_TOKEN="" # 使用wechaty-puppet-padlocal、wechaty-puppet-service时需配置此token

# 基础配置
ADMINROOM_ADMINROOMID=""  # 管理群ID，与管理员群名称任选其一，群ID优先级高于群名称
ADMINROOM_ADMINROOMTOPIC="瓦力是群主" # 管理群名称，需尽量保持名称复杂，避免重名群干扰
BASE_WELCOM_EMESSAGE_FOR_JOIN_ROOM="" # 默认进群欢迎语
BASE_WELCOME_MESSAGE_FOR_ADD_FRIEND="" # 默认添加好友自动回复

# 智能问答配置
AUTOQA_TYPE="wxOpenai" # TBD-可选值：WxOpenai、ChatGPT
WXOPENAI_TOKEN="" # 微信对话开放平台中获取
WXOPENAI_ENCODINGAESKEY="" # 微信对话开放平台中获取
CHATGPT_KEY="" # openai key
CHATGPT_ENDPOINT="https://www.openai.com" # openai api请求地址，国内使用官方api可以替换为https://www.openai-proxy.com

# MQTT配置
MQTT_USERNAME="" # MQTT连接配置信息，推荐使用百度云的物联网核心套件
MQTT_PASSWORD="" # MQTT连接配置信息，推荐使用百度云的物联网核心套件
MQTT_ENDPOINT="" # MQTT连接配置信息，推荐使用百度云的物联网核心套件
MQTT_PORT=1883 # MQTT连接配置信息，推荐使用百度云的物联网核心套件

# 消息推送目的地配置
WEBHOOK_URL=""
WEBHOOK_TOKEN=""
WEBHOOK_USERNAME=""
WEBHOOK_PASSWORD=""

# 语雀配置
YUQUE_TOKEN=""
YUQUE_NAMESPACE=""
```

> 只有加入到roomWhiteList里的群才会开启只能问答机器人

5.初始化系统表，先运行，系统会自动在维格表中创建好初始化表格

```Shell
npm run sys-init
```

在维格表查看系统表是否创建成功

6.程序默认使用wechaty-puppet-wechat，三大系统均可使用

7.启动程序

```Shell
npm start
```

出现二维码之后，扫码二维码登陆微信

8.开启智能问答功能

8.1 设置微信对话平台token，填写"环境变量"表中的 【对话平台token】、【对话平台EncodingAESKey】并在"功能开关"表中开启智能问答

添加一个简单问题到微信对话开放平台，测试对应群内智能问答内容

8.2 如果不希望每个群都开启智能问答，需设置群白名单,首先需要将上图中的群白名单开关设置为开启

然后将群加入到问答白名单，在“群白名单”表中，加入需要开启的群ID（roomid），群ID在消息中查看(在群里发一条消息，然后控制台查看或在维格表中查找)

详细操作参考 [手把手教程](https://www.yuque.com/atorber/oegota/zm4ulnwnqp9whmd6)

8.4 重启程序，在指定群测试问答

## 使用环境变量启动

> 也可以不使用配置文件，通过配置环境变量启动

Mac、Linux操作系统下运行(仅支持使用wechaty-puppet-wechat和wechaty-puppet-padlocal)

```Shell
export VIKA_TOKEN="替换成自己的维格表token"
export VIKA_SPACE_NAME="替换成你的维格表空间名称"
npm run sys-init
npm start
```

Windows操作系统下运行(支持使用wechaty-puppet-xp、wechaty-puppet-wechat、wechaty-puppet-padlocal)

推荐使用 wechaty-puppet-xp（在电脑上登陆微信，微信版本必须为[WeChatSetup-v3.6.0.18.exe](https://github.com/tom-snow/wechat-windows-versions/releases/download/v3.6.0.18/WeChatSetup-3.6.0.18.exe)）

```Shell
set VIKA_TOKEN="替换成自己的维格表token"
set VIKA_SPACE_NAME="替换成你的维格表空间名称"
npm run sys-init
npm run start
```

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

- 稳定版本

```Shell
docker run -d 
--restart=always 
--env VIKA_TOKEN="维格表token" 
--env VIKA_SPACE_NAME="维格表空间名称" 
atorber/wechat-openai-qa-bot:v1.8.2
```

- 最新版本

```Shell
docker run -d 
--restart=always 
--env VIKA_TOKEN="维格表token" 
--env VIKA_SPACE_NAME="维格表空间名称" 
atorber/wechat-openai-qa-bot:latest
```

## 视频演示及使用教程

到项目官网 [查看视频教程](https://qabot.vlist.cc/)

## 常见问题及解决方案

1. 加入QQ群 583830241 在线交流，添加 ledongmao 微信

2. 到 [项目语雀知识库](https://www.yuque.com/atorber/oegota/ibnui5v8mob11d70) 查看常用问题

3. 提交一个issues <https://github.com/choogoo/wechat-openai-qa-bot/issues>

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

- [vue-im](https://github.com/polk6/vue-im)

  由@polk6开源的客服web项目，实现客服后台回复咨询消息

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=choogoo/chatflow&type=Date)](https://star-history.com/#choogoo/chatflow&Date)
