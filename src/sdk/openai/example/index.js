"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
(0, index_1.init)({
    TOKEN: 'PWj9xdSdGU3PPnqUUrTf7uGgQ9Jvn7',
    EncodingAESKey: '4jzHSI2p3EHXh3qBao5onJ39HcOO00ZoiGVNVvjFkPW'
});
(0, index_1.chat)({
    username: "uid",
    msg: "你好吗"
}).then(function (res) {
    console.log('机器人返回:', res);
}, function (res) {
    console.log('reject res:', res);
}).catch(function (e) {
    console.log('error', e);
});
// 分词
index_1.nlp.tokenize({
    uid: "uid",
    data: {
        q: "我的家乡叫中国。"
    }
}).then(function (res) {
    console.log('词法分析返回：', res);
}, function (res) {
    console.log('reject res:', res);
}).catch(function (e) {
    console.log('error', e);
});
// 数字日期时间识别
index_1.nlp.ner({
    uid: "uid",
    data: {
        q: "帮我订两张后天上午的火车票"
    }
}).then(function (res) {
    console.log('数字日期时间识别返回：', res);
}, function (res) {
    console.log('reject res:', res);
}).catch(function (e) {
    console.log('error', e);
});
// 情感分析
index_1.nlp.sentiment({
    uid: "uid",
    data: {
        q: "恭喜小张脱单成功",
        mode: "6class"
    }
}).then(function (res) {
    console.log('情感分析返回：', res);
}, function (res) {
    console.log('reject res:', res);
}).catch(function (e) {
    console.log('error', e);
});
// 敏感词识别
index_1.nlp.sensitive({
    uid: "uid",
    data: {
        q: "楼主真垃圾，祝你早日死全家"
    }
}).then(function (res) {
    console.log('敏感词识别返回：', res);
}, function (res) {
    console.log('reject res:', res);
}).catch(function (e) {
    console.log('error', e);
});
