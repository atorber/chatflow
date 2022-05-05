#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
/**
 * Wechaty - Conversational RPA SDK for Chatbot Makers.
 *  - https://github.com/wechaty/wechaty
 */
// https://stackoverflow.com/a/42817956/1123955
// https://github.com/motdotla/dotenv/issues/89#issuecomment-587753552
require("dotenv/config.js");
var wechaty_1 = require("wechaty");
var qrcode_terminal_1 = require("qrcode-terminal");
var request_promise_1 = require("request-promise");
// const rp = require('request-promise')
var WX_TOKEN = '' // 替换为微信开放平台TOKEN或者使用环境变量，推荐使用环境变量
var TOKEN = WX_TOKEN || process.env['WX_TOKEN'];
function onScan(qrcode, status) {
    if (status === wechaty_1.ScanStatus.Waiting || status === wechaty_1.ScanStatus.Timeout) {
        var qrcodeImageUrl = [
            'https://wechaty.js.org/qrcode/',
            encodeURIComponent(qrcode),
        ].join('');
        wechaty_1.log.info('StarterBot', 'onScan: %s(%s) - %s', wechaty_1.ScanStatus[status], status, qrcodeImageUrl);
        qrcode_terminal_1["default"].generate(qrcode, { small: true }); // show qrcode on console
    }
    else {
        wechaty_1.log.info('StarterBot', 'onScan: %s(%s)', wechaty_1.ScanStatus[status], status);
    }
}
function onLogin(user) {
    wechaty_1.log.info('StarterBot', '%s login', user);
}
function onLogout(user) {
    wechaty_1.log.info('StarterBot', '%s logout', user);
}
function onMessage(message) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wechaty_1.log.info('StarterBot', JSON.stringify(message));
                    if (!(message.text() === 'ding')) return [3 /*break*/, 2];
                    return [4 /*yield*/, message.say('dong')];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    if (!(message.room() && message.room().id && message.type() === bot.Message.Type.Text)) return [3 /*break*/, 4];
                    return [4 /*yield*/, wxai(message)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
var bot = wechaty_1.WechatyBuilder.build({
    name: 'ding-dong-bot',
    /**
     * How to set Wechaty Puppet Provider:
     *
     *  1. Specify a `puppet` option when instantiating Wechaty. (like `{ puppet: 'wechaty-puppet-whatsapp' }`, see below)
     *  1. Set the `WECHATY_PUPPET` environment variable to the puppet NPM module name. (like `wechaty-puppet-whatsapp`)
     *
     * You can use the following providers locally:
     *  - wechaty-puppet-wechat (web protocol, no token required)
     *  - wechaty-puppet-whatsapp (web protocol, no token required)
     *  - wechaty-puppet-padlocal (pad protocol, token required)
     *  - etc. see: <https://wechaty.js.org/docs/puppet-providers/>
     */
    puppet: 'wechaty-puppet-xp'
});
bot.on('scan', onScan);
bot.on('login', onLogin);
bot.on('logout', onLogout);
bot.on('message', onMessage);
bot.start()
    .then(function () { return wechaty_1.log.info('StarterBot', 'Starter Bot Started.'); })["catch"](function (e) { return wechaty_1.log.error('StarterBot', e); });
function wxai(message) {
    return __awaiter(this, void 0, void 0, function () {
        var room, talker, roomid, text, answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    room = message.room();
                    talker = message.talker();
                    roomid = room.id;
                    text = message.text();
                    return [4 /*yield*/, aibot(room, text)];
                case 1:
                    answer = _a.sent();
                    console.debug('answer=====================', answer);
                    if (!answer) return [3 /*break*/, 3];
                    return [4 /*yield*/, room.say.apply(room, __spreadArray([answer], [talker,], false))];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
;
function getSignature(room) {
    return __awaiter(this, void 0, void 0, function () {
        var query, method, uri, headers, topic, body, opt, res, signature, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = {};
                    method = 'POST';
                    uri = "https://openai.weixin.qq.com/openapi/sign/".concat(TOKEN);
                    headers = {};
                    return [4 /*yield*/, room.topic()];
                case 1:
                    topic = _a.sent();
                    body = {
                        username: topic,
                        avatar: '',
                        userid: room.id
                    };
                    opt = {
                        method: method,
                        uri: uri,
                        qs: query,
                        body: body,
                        headers: headers,
                        json: true
                    };
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, request_promise_1["default"])(opt)
                        // console.debug(res)
                    ];
                case 3:
                    res = _a.sent();
                    signature = res.signature;
                    return [2 /*return*/, signature];
                case 4:
                    err_1 = _a.sent();
                    console.error(err_1);
                    return [2 /*return*/, err_1];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function aibot(room, query) {
    return __awaiter(this, void 0, void 0, function () {
        var signature, method, uri, headers, body, opt, roomid, answer, resMsg, msgText, answers, i, textArr, textArr, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getSignature(room)];
                case 1:
                    signature = _a.sent();
                    method = 'POST';
                    uri = "https://openai.weixin.qq.com/openapi/aibot/".concat(TOKEN);
                    headers = {};
                    body = {
                        signature: signature,
                        query: query
                    };
                    opt = {
                        method: method,
                        uri: uri,
                        qs: {},
                        body: body,
                        headers: headers,
                        json: true
                    };
                    roomid = room.id;
                    answer = '';
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, request_promise_1["default"])(opt)
                        // console.debug(JSON.stringify(resMsg))
                    ];
                case 3:
                    resMsg = _a.sent();
                    // console.debug(JSON.stringify(resMsg))
                    if (resMsg.answer_type == 'text') {
                        msgText = resMsg.answer;
                        console.debug('msgText==========', msgText);
                        try {
                            msgText = JSON.parse(msgText);
                            console.debug('msgText JSON==========', msgText);
                            if (msgText.multimsg && msgText.multimsg.length) {
                                answers = msgText.multimsg;
                                console.debug('answers============', answers);
                                for (i in answers) {
                                    textArr = answers[i].split(roomid);
                                    console.debug('textArr===========', textArr);
                                    if (textArr.length == 2) {
                                        answer = textArr[1];
                                    }
                                }
                                return [2 /*return*/, answer];
                            }
                            console.debug('msgText.multimsg不存在或数量小于1');
                            return [2 /*return*/, answer];
                        }
                        catch (err) {
                            textArr = msgText.split(roomid);
                            if (textArr.length == 2) {
                                answer = textArr[1];
                                return [2 /*return*/, answer];
                            }
                            console.debug('当前群QA不存在:', roomid, query);
                            return [2 /*return*/, answer];
                        }
                    }
                    return [2 /*return*/, answer];
                case 4:
                    err_2 = _a.sent();
                    console.error(err_2);
                    return [2 /*return*/, answer];
                case 5: return [2 /*return*/];
            }
        });
    });
}
