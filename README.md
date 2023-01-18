# Wechat-Openai-QA-Bot

[访问项目语雀文档了解更多信息](https://www.yuque.com/atorber/oegota)

## 简介

本项目使用wechat机器人快速实现一个免费的QA问答系统，如果你是一个社群工作者、拼团团长、业务群运营经理，使用这个项目可以帮助你解决一些重复性问答。

同时，本项目也具备微信消息收集、定时通知等常用场景功能。

已适配网页版微信，linux、mac、Windows均可运行。

### 功能列表

- 功能开关

![image](https://user-images.githubusercontent.com/104893934/208631837-74232f1c-122c-420f-8bd5-0a5b5fb9c8ac.png)

- 可视化配置环境变量

![image](https://user-images.githubusercontent.com/104893934/208632380-8c6260e7-a592-4f65-85f5-1d873e041dfe.png)

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

1. 下载源码并安装依赖

```
git clone https://github.com/choogoo/wechat-openai-qa-bot.git
cd ./wechat-openai-qa-bot
npm install
```

2. 分别登陆[微信对话开放平台](https://openai.weixin.qq.com/)和[vika维格表](https://spcp52tvpjhxm.com.vika.cn/?inviteCode=55152973)官网注册账号并获取token

3. 在电脑上登陆微信，微信版本必须为[WeChatSetup-v3.6.0.18.exe](https://github.com/tom-snow/wechat-windows-versions/releases/download/v3.6.0.18/WeChatSetup-3.6.0.18.exe)

4. 修改./config.js配置文件

快速开始仅需要修改VIKA_TOKEN、VIKA_SPACENAME配置项,其他配置项暂时无需修改

```
/* eslint-disable sort-keys */
// 配置文件，所有配置必须齐全，补充空白配置项，其他配置项可按需要修改
const configs = {
  VIKA_TOKEN: '替换成自己的维格表token', // VIKA维格表token
  VIKA_SPACENAME: '替换成你的维格表空间名称', // VIKA维格表空间名称，修改为自己的空间名称
}

export default configs
```

> 只有加入到roomWhiteList里的群才会开启只能问答机器人

5. 初始化系统表，先运行，系统会自动在维格表中创建好初始化表格

```
npm run sys-init
```

在维格表查看系统表是否创建成功

<img width="1438" alt="image" src="https://user-images.githubusercontent.com/104893934/208945350-65825003-fc34-451b-88af-cb6877a800fc.png">

6. 程序默认使用wechaty-puppet-wechat，三大系统均可使用

7. 启动程序

```
npm start
```
出现二维码之后，扫码二维码登陆微信

看到如下界面，说明运行成功了

<img width="786" alt="image" src="https://user-images.githubusercontent.com/104893934/203388629-c8081f57-dfd6-46c8-abb3-3a064e76bbc9.png">

8.开启智能问答功能

8.1 设置微信对话平台token，填写"环境变量"表中的 【对话平台token】、【对话平台EncodingAESKey】并在"功能开关"表中开启智能问答

<img width="1436" alt="image" src="https://user-images.githubusercontent.com/104893934/208946437-d2e2251c-e8dc-4332-b482-78f995cdee26.png">

<img width="1439" alt="image" src="https://user-images.githubusercontent.com/104893934/208946777-2123ce1e-b858-41e6-8e32-2b11e9749a13.png">

添加一个简单问题到微信对话开放平台，测试对应群内智能问答内容

8.2 如果不希望每个群都开启智能问答，需设置群白名单,首先需要将上图中的群白名单开关设置为开启

然后将群加入到问答白名单，在“群白名单”表中，加入需要开启的群ID（roomid），群ID在消息中查看(在群里发一条消息，然后控制台查看或在维格表中查找)

- 获取群ID

<img width="1378" alt="image" src="https://user-images.githubusercontent.com/104893934/203391583-a8c2d3ca-5604-4947-9371-f45b8261fc95.png">

<img width="1139" alt="image" src="https://user-images.githubusercontent.com/104893934/203391251-db34aaa9-c2f1-42dc-8bf2-ed3a2cef707f.png">

- 添加白名单

![image](https://user-images.githubusercontent.com/104893934/203492852-95c083dd-6357-43ec-bba6-6170f1d47cd3.png)

8.3 在微信对话平台中录入问答内容，以群名称建立分类，问答时会优先匹配群名称对应的分类，匹配不到时匹配【通用问题】分类

<img width="1423" alt="image" src="https://user-images.githubusercontent.com/104893934/203390223-9a0ac292-fde9-4114-85dc-9c70a97b917b.png">

8.4 重启程序，在指定群测试问答

## 使用环境变量启动

> 也可以不使用配置文件，通过配置环境变量启动

Mac、Linux操作系统下运行(仅支持使用wechaty-puppet-wechat和wechaty-puppet-padlocal)

```
export VIKA_TOKEN="替换成自己的维格表token"
export VIKA_SPACENAME="替换成你的维格表空间名称"
npm run sys-init
npm start
```

Windows操作系统下运行(支持使用wechaty-puppet-xp、wechaty-puppet-wechat、wechaty-puppet-padlocal)

推荐使用 wechaty-puppet-xp

```
set VIKA_TOKEN="替换成自己的维格表token"
set VIKA_SPACENAME="替换成你的维格表空间名称"
npm run sys-init
npm run start
```

## 在Docker中部署运行

注意，因为wechaty-puppet-xp必须依赖Windows微信客户端，所以不能使用Docker，但使用、、wechaty-puppet-padlocal、wechaty-puppet-service则可以用Doker来部署，最新代码已经默认wechaty-puppet-wehcat为初始化puppet，mac、linux系统直接拉取镜像即可运行（mac M1需要自行打包镜像）

### Wechaty-Puppet支持

|puppet名称|支持平台	|需要token	|付费|	备注|
|--|--|--|--|--|
|wechaty-puppet-wechat|	Windows、Linux、macOS	|否|	否	|网页版wechat，无法获取真实的微信ID和群ID，重启之后ID可能会变|
|wechaty-puppet-xp|Windows|	否|	否	|仅支持windows|
|wechaty-puppet-padlocal👍|	Windows、Linux、macOS|	是	|是	|
|wechaty-puppet-service👍|	Windows、Linux、macOS|	是	|是	|企业微信|

### 拉取和运行

- 稳定版本

```
docker run -d --restart=always --env VIKA_TOKEN="维格表token" --env VIKA_SPACENAME="维格表空间名称" atorber/wechat-openai-qa-bot:v1.8.2
```

- 最新版本

```
docker run -d --restart=always --env VIKA_TOKEN="维格表token" --env VIKA_SPACENAME="维格表空间名称" atorber/wechat-openai-qa-bot:latest
```

## 视频演示及使用教程

到项目官网 [查看视频教程](https://qabot.vlist.cc/)

## 常见问题及解决方案

1. 加入QQ群 583830241 在线交流，添加 ledongmao 微信

2. 到 [项目语雀知识库](https://www.yuque.com/atorber/oegota/ibnui5v8mob11d70) 查看常用问题

3. 提交一个issues https://github.com/choogoo/wechat-openai-qa-bot/issues 

## 效果展示

### 群消息存档

<img src="https://user-images.githubusercontent.com/19552906/167827644-a4cad573-b26f-4701-a27f-1ada1d2ffb47.png" width="60%">

### 常见问题问答自动回复

<img src="https://user-images.githubusercontent.com/104893934/167547910-4550f388-ee15-478c-8345-560b98367d88.png" width="60%">

### 问答列表

<img src="https://user-images.githubusercontent.com/104893934/167548122-e97bd126-4df9-410c-b87c-876df3f7aacf.png" width="60%">

### 编辑问题

<img src="https://user-images.githubusercontent.com/104893934/167548070-31c847ae-b876-4051-bccf-ed81baad56b9.png" width="60%">

### 非本群链接检测

<img src="https://user-images.githubusercontent.com/104893934/167547463-0b943e27-4667-4266-bed4-1fd020637902.png" width="60%">

### 客服后台系统

<img src="https://user-images.githubusercontent.com/104893934/169646853-b635e1ad-92fd-4fd4-b62a-c165e5ba4796.png" width="60%">

### 快团团订单自动汇总

- 发送原始订单表到群内自动生成按楼栋汇总好的表格

<img src="https://user-images.githubusercontent.com/104893934/167663152-94127586-5429-4689-bba8-379127606a56.png" width="60%">

- 快团团后台导出的全部字段原始表

<img src="https://user-images.githubusercontent.com/104893934/168030413-f13c2107-d54f-4921-b361-948ac28a0841.png" width="60%">

- 生成汇总表

<img src="https://user-images.githubusercontent.com/104893934/168030570-b88991f4-be4b-4479-94e7-0041d0508fc1.png" width="60%">

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

- [Wechaty](https://wechaty.js.org/) —— 只需几行代码，您就可以拥有一个功能齐全的聊天机器人

- [wechaty-puppet-xp](https://github.com/wechaty/puppet-xp) —— 可能是目前最好用的免费wechat机器人

- [wechaty-puppet-wechat](https://github.com/wechaty/puppet-wechat) —— 目前最简单的免费wechat机器人

- [微信对话开放平台](https://openai.weixin.qq.com/) —— 5分钟零基础免费一键搭建智能对话机器人，并应用于微信公众号、小程序、企业网站、APP等

- [vika维格表](https://spcp52tvpjhxm.com.vika.cn/?inviteCode=55152973) —— 将过去复杂的IT数据库技术，做得像表格一样简单(如果要注册，通过这个链接，或者使用邀请码 55152973 )

- [vue-im](https://github.com/polk6/vue-im) —— 由@polk6开源的客服web项目，实现客服后台回复咨询消息
