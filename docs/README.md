## 简介

本项目使用wechat机器人快速实现一个免费的QA问答系统，如果你是一个社群工作者、拼团团长、业务群运营经理，使用这个项目可以帮助你解决一些重复性问答。

~~前提是你有一台Windows电脑可以运行本项目，仅支持Windows环境下运行。~~ 

乐大喜奔，已适配网页版微信，linux、mac、Windows均可运行。

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

### 视频演示

#### 部署运行

<div style="position:relative; padding-bottom:75%; width:100%; height:0">
    <iframe src="//player.bilibili.com/player.html?aid=853865811&bvid=BV1Y54y1f7v1&cid=714379422&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" style="position:absolute; height: 100%; width: 100%;"></iframe>
</div>

#### 功能演示

<div style="position:relative; padding-bottom:75%; width:100%; height:0">
    <iframe src="//player.bilibili.com/player.html?aid=511574788&bvid=BV1Ju41167Qo&cid=721650219&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" style="position:absolute; height: 100%; width: 100%;"></iframe>
</div>

#### 客服系统

<div style="position:relative; padding-bottom:75%; width:100%; height:0">
    <iframe src="//player.bilibili.com/player.html?aid=639343626&bvid=BV1CY4y167YD&cid=726317086&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" style="position:absolute; height: 100%; width: 100%;"></iframe>
</div>

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

## 使用教程

> 提示：2022-5-13最新版本里需要在config.js文件中修改自己的微信对话开放平台、VIKA维格表的token，维格表token的获取方式请自行浏览官方网站,同时需要在维格表中创建一个名为 mp-chatbot 的空间，关于维格表的操作可以参考[wechaty-vika-link](https://github.com/atorber/wechaty-vika-link/tree/anti-epidemic)

### 环境准备

1. clone （下载）项目代码,运行以下命令：

```
git clone https://github.com/atorber/wechaty-wx-openai-link.git
```

考虑对git不熟悉的用户，可以在页面直接下载项目.zip到电脑上,下载后解压缩即可

<img src="https://user-images.githubusercontent.com/104893934/178886578-a32ac8fc-2efe-4280-be45-59fa918f24a4.png" width="60%">

下载解压缩之后的目录

<img src="https://user-images.githubusercontent.com/104893934/178886647-b1f6193a-58b1-4f35-a82c-0f1c3b6d90e7.png" width="60%">

2. 安装nodejs，项目的tools目录下有相应的安装包node-v16.15.0-x64.zip，解压缩并安装；

3. 下载WeChatSetup-v3.3.0.115并安装（点击下载[WeChatSetup-v3.3.0.115.exe](https://github.com/wechaty/wechaty-puppet-xp/releases/download/v0.5/WeChatSetup-v3.3.0.115.exe)）

> 特别注意目前支持的微信客户端版本为 WeChatSetup-v3.3.0.115,如果电脑上已经安装了其他版本的微信，需要卸载之后安装项目中的版本

### 安装依赖

1. 假设当前系统为win10，在系统搜索栏中输入 powershell ，选择第一个结果

<img src="https://user-images.githubusercontent.com/104893934/178886715-8370286a-8bfe-49d4-b7aa-270b396c7d82.png" width="60%">

2. 打开Windows PoweShell

<img src="https://user-images.githubusercontent.com/104893934/178886782-66c60bde-71a5-45a5-84be-aabb199104c4.png" width="60%">


3. 到项目目录下用鼠标点击地址栏复制文件路径，例如我当前的路径为 C:\Users\wechaty\Documents\GitHub\wechaty-wx-openai-link

<img src="https://user-images.githubusercontent.com/104893934/178886794-8e3be7d6-a64b-4810-b1fd-acdc934f2807.png" width="60%">


4. 在复制如下命令在Windows PoweShell中执行

```
cd C:\Users\wechaty\Documents\GitHub\wechaty-wx-openai-link
npm install
```

### 问答平台注册

1. 微信对话开放平台注册，访问[https://openai.weixin.qq.com/](https://openai.weixin.qq.com/)，导入示例数据及获取token

> 示例问答中的 xxx@chatroom 为你需要引入QA的群，此处特别注意，必须在回答中以 **QA+xxx@chatroom+回答内容** 才能达到在不同的群内有不同回答的效果

2. 扫码登陆

<img src="https://user-images.githubusercontent.com/104893934/178886931-19fb0d67-3682-4dea-8978-dc53acb59bcd.png" width="60%">


3. 填写机器人信息

<img src="https://user-images.githubusercontent.com/104893934/178886955-f2aed93a-0667-44ac-b657-a7dc6b901bc0.jpg" width="60%">


4. 批量导入问答

<img src="https://user-images.githubusercontent.com/104893934/178886977-38854ae9-21d6-45f7-8963-09d0a827c13b.png" width="60%">


5. 选择项目中tools目录下的示例问答

<img src="https://user-images.githubusercontent.com/104893934/178887001-53c16428-77da-4eba-8044-c9a9a2714174.png" width="60%">


6. 上传问答

<img src="https://user-images.githubusercontent.com/104893934/178887023-7508dd4a-c7b1-4ac1-a848-05ec909125fd.png" width="60%">


7. 导入成功后问答列表

<img src="https://user-images.githubusercontent.com/104893934/178887050-5a28fb3e-34c9-44fc-99b9-3413883ad995.png" width="60%">


8. 上线发布

<img src="https://user-images.githubusercontent.com/104893934/178887066-d26a9c74-96c6-463a-8ac7-117b72e13dc4.png" width="60%">

9. 发布成功

<img src="https://user-images.githubusercontent.com/104893934/178887079-5b17ab07-8e7f-4c8f-87bf-5ed7da546ad8.png" width="60%">


10. 应用绑定，获取token

<img src="https://user-images.githubusercontent.com/104893934/178887115-6a2b14cb-6ccc-43c6-961d-d5c1bbcd58b6.png" width="60%">


11. 填写申请信息，提交后马上就会审核通过

<img src="https://user-images.githubusercontent.com/104893934/178887131-db6248c0-302d-418f-bfa6-0ca5952d3f40.png" width="60%">


12. 开通成功，复制token备用

<img src="https://user-images.githubusercontent.com/104893934/178887148-88e681c2-db4e-4051-a94f-215a1231eabb.png" width="60%">

### 维格表注册

维格表token的获取方式请自行浏览[vika维格表](https://spcp52tvpjhxm.com.vika.cn/?inviteCode=55152973)官方网站,同时需要在维格表中创建一个名为 mp-chatbot 的空间，关于维格表的操作可以参考[wechaty-vika-link](https://github.com/atorber/wechaty-vika-link/tree/anti-epidemic)

### 修改配置

在获取token之后，更新token到配置文件中，准备启动系统

```
const configs = {
  WX_TOKEN: '', // 微信对话平台token
  VIKA_TOKEN: '', // VIKA维格表token
  VIKA_SPACENAME:'',  // VIKA维格表空间名称，修改为自己的已存在的任意空间名称
  VIKA_DATASHEETNAME:'', // VIKA维格表名称,修改为自己的表名称，可填写任意名称，不需要在维格表中建表，程序会自动建表
  linkWhiteList: ['ledongmao',],  // 群内链接检测白名单，白名单里成员发布的卡片、链接消息不提示
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
  imOpen: true,  // 是否开启uve-im客户端，设置为true时，需要先 cd ./vue-im 然后 npm install 启动服务 npm run dev
  noderedOpen: false,  // 是否开启nodered，开启nodered后可以以可视化界面启动机器人，需要先导入 ./tools 目录下的 flows.json
}
```

### 启动程序

执行如下命令

```
npm run start
```

顺利的话，恭喜你已经拥有一个QA机器人，接下来你需要在简单问答中继续导入你需要的问答内容

不顺利的话...请截图留言...

- 程序运行成功

<img src="https://user-images.githubusercontent.com/104893934/178887182-bb72a4f0-f2ff-4b52-b67e-d8832844c180.png" width="60%">

### 客服系统

1. 修改配置文件中imOpen为`imOpen: true`

2. 启动vue-im再启动主程序

```
cd ./vue-im
npm install
npm run dev
```

3. 启动后浏览器中访问 http://localhost:8080/#/imServer 即可打开客服管理后台

4. 到根目录运行`npm run start`启动主程序

### 添加问答

修改./tools/export_skills_70785_1651747894.csv ,添加需要的问答和答案，重新覆盖导入

## 效果展示

### 群消息存档

<img src="https://user-images.githubusercontent.com/19552906/167827644-a4cad573-b26f-4701-a27f-1ada1d2ffb47.png" width="60%">

### 自动问答回复

<img src="https://user-images.githubusercontent.com/104893934/167547910-4550f388-ee15-478c-8345-560b98367d88.png" width="60%">

### 问题管理

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

## DEMO体验

如果你对以上操作感觉困难而不能使用，添加ledongmao微信，提供你需要的问答清单，我们可以提供一个免费的机器人供体验

当然，最好的反馈方式是在这里 https://github.com/choogoo/wechat-openai-qa-bot/issues 提交一个issues

- 扫码加入体验群

![7033bbce3c0c74c97cf8b4b815b4dd1](https://user-images.githubusercontent.com/104893934/180383667-0ec86fc8-4c42-41d9-97e7-cb0d848a6c60.jpg)

## 二次开发

此项目只是提供了一个简单的使用微信机器人和智能对话平台实现的QA系统。如果有兴趣，可以继续学习微信对话开放平台的高级技能，实现诸如连续问答等高级功能，欢迎贡献你的创意。

此外要说明的是，项目中使用puppet-xp完全是出于免费的考虑，如果不考虑这一点的话，wechaty还有更好用的puppet，对于有能力的开发者来说可以根据实际情况替换。

## 常见问题

**遇到任何报错，一定记得第一时间查看报错信息，即使看不懂，起码复制或截图，否则没有人能仅凭几句语焉不详帮你解决问题**

### 环境依赖

- Windows > 10

- nodejs > 16

- npm > 7

### 切换网页版微信

将【Windows桌面版微信】代码注释掉，【网页版微信】代码取消注释，重新运行程序即可

```
// Windows桌面版微信
const bot = WechatyBuilder.build({
  name: 'openai-qa-bot',
  puppet: 'wechaty-puppet-xp',
})

// 网页版微信
// const bot = WechatyBuilder.build({
//   name: 'openai-qa-bot',
//   puppet: 'wechaty-puppet-wechat', 
//   puppetOptions: {
//     uos: true
//   }
// })
```

### 安装和运行

1. 安装依赖时提示需要Visual Studio 2017+

去微软官网下载[Visual Studio 2022](https://visualstudio.microsoft.com/zh-hans/thank-you-downloading-visual-studio/?sku=Community&channel=Release&version=VS2022&source=VSLandingPage&cid=2030&passive=false)并安装

<img src="https://user-images.githubusercontent.com/104893934/167300714-49a0dc40-8857-4e81-a780-80e63af74d97.png" width="60%">

2. 关于远程协助，如果折腾半天也没有搞定，可以联系申请远程协助指导安装

提前下载好[向日葵](https://sunlogin.oray.com/download)软件并注册号账号，登陆后发控制码

<img src="https://user-images.githubusercontent.com/104893934/167300700-19c6283b-584c-48f4-bc10-7418cc7528f3.png" width="60%">

3. 下载解压缩软件

[2345好压](https://haozip.2345.cc/)
