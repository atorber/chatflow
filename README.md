# Wechat-Openai-QA-Bot

[访问官网了解更多信息](https://qabot.vlist.cc/)

## 简介

本项目使用wechat机器人快速实现一个免费的QA问答系统，如果你是一个社群工作者、拼团团长、业务群运营经理，使用这个项目可以帮助你解决一些重复性问答。

~~前提是你有一台Windows电脑可以运行本项目，仅支持Windows环境下运行。~~ 

乐大喜奔，已适配网页版微信（基于wechaty-puppet-wechat，截止2022年7月25日网页版微信支持所有微信用户登陆），linux、mac、Windows均可运行。

### 功能列表

|功能|描述|
|--|--|
| 智能问答|可以自定义问答内容，智能匹配答案，支持相似问题匹配，例如“什么时候到货？”“亲，几时到货”“亲，什么时候到货”均能匹配（基于微信对话开放平台，免费）|
|千群千面|多个群相同问题不同回答内容,例如“何时到货？”,A群中回答“今天到”，B群中回答“明天到货”|
|免打扰|使用“QA+群ID+回答内容”匹配群，未配置问题答案的群不会受到机器人干扰|
|非群主链接检测|支持非群主小程序卡片、网页链接分享检测，自动提醒、警告发送者撤回|
|团购订单转换|支持快团团订货单转换，原始表发送到群即可自动转换为按楼栋统计表|
|消息存档|群聊天消息存档到表格（基于vika维格表，免费）|
|客服后台|简单客服后台，可以把群内消息按发言人列表区分|

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

## 快速开始

1. 下载源码并安装依赖

```
git clone https://github.com/choogoo/wechat-openai-qa-bot.git
npm install
```

2. 分别登陆[微信对话开放平台](https://openai.weixin.qq.com/)和[vika维格表](https://spcp52tvpjhxm.com.vika.cn/?inviteCode=55152973)官网注册账号并获取token

3. 在电脑上登陆微信，微信版本必须为[WeChatSetup-v3.3.0.115.exe](https://github.com/wechaty/wechaty-puppet-xp/releases/download/v0.5/WeChatSetup-v3.3.0.115.exe)

4. 修改配置文件

快速开始仅需要修改WX_TOKEN、VIKA_TOKEN、VIKA_SPACENAME、VIKA_DATASHEETNAME四个配置项

```
const configs = {
  WX_TOKEN: '', // 微信对话平台token
  VIKA_TOKEN: '', // VIKA维格表token
  VIKA_SPACENAME:'',  // VIKA维格表空间名称，修改为自己的已存在的任意空间名称
  VIKA_DATASHEETNAME:'', // VIKA维格表名称,修改为自己的表名称，可填写任意名称，不需要在维格表中建表，程序会自动建表
  linkWhiteList: ['ledongmao',],  // 群内链接检测白名单，白名单里成员发布的卡片、链接消息不提示
  imOpen: false,  // 是否开启uve-im客户端，设置为true时，需要先 cd ./vue-im 然后 npm install 启动服务 npm run dev
  noderedOpen: false,  // 是否开启nodered，开启nodered后可以以可视化界面启动机器人，需要先导入 ./tools 目录下的 flows.json
}
```

5. 启动

```
npm start
```
## 视频演示及使用教程

[到项目官网查看视频教程](https://qabot.vlist.cc/)

## 快速体验

如果你对以上操作感觉困难而不能使用，添加 ledongmao 微信，提供你需要的问答清单，我们可以提供一个免费的机器人供体验

当然，最好的反馈方式是在这里 https://github.com/choogoo/wechat-openai-qa-bot/issues 提交一个issues

- 扫码加入体验群

![7033bbce3c0c74c97cf8b4b815b4dd1](https://user-images.githubusercontent.com/104893934/180383667-0ec86fc8-4c42-41d9-97e7-cb0d848a6c60.jpg)

## 在线交流

QQ群 583830241

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
