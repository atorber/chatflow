# wechat客服系统

基于另一个开源项目[vue-im](https://github.com/polk6/vue-im)二次开发的客服系统，对接微信chatbot实现群消息转换为单聊模式，并支持快捷答复。

感谢作者[@fang mu](https://github.com/polk6)

# Features
* 支持1客服对多用户
* 当前仅支持文本消息

## im-server im服务端

<img src="https://user-images.githubusercontent.com/104893934/169646853-b635e1ad-92fd-4fd4-b62a-c165e5ba4796.png" width="60%">

## Usage
```
npm install
npm run dev
```

启动后使用谷歌浏览器访问http://localhost:8080/#/imServer

## Express-server

./build/webpack.dev.conf.js 内置了一个Express服务，后台接口都在此处
