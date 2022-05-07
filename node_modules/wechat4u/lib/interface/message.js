'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = MessageFactory;

var _util = require('../util');

/* Message Object Example
{
    "FromUserName": "",
    "ToUserName": "",
    "Content": "",
    "StatusNotifyUserName": "",
    "ImgWidth": 0,
    "PlayLength": 0,
    "RecommendInfo": {},
    "StatusNotifyCode": 4,
    "NewMsgId": "",
    "Status": 3,
    "VoiceLength": 0,
    "ForwardFlag": 0,
    "AppMsgType": 0,
    "Ticket": "",
    "AppInfo": {...},
    "Url": "",
    "ImgStatus": 1,
    "MsgType": 1,
    "ImgHeight": 0,
    "MediaId": "",
    "MsgId": "",
    "FileName": "",
    "HasProductId": 0,
    "FileSize": "",
    "CreateTime": 0,
    "SubMsgType": 0
}
*/

var messageProto = {
  init: function init(instance) {
    var _this = this;

    this.MsgType = +this.MsgType;
    this.isSendBySelf = this.FromUserName === instance.user.UserName || this.FromUserName === '';

    this.OriginalContent = this.Content;
    if (this.FromUserName.indexOf('@@') === 0) {
      this.Content = this.Content.replace(/^@.*?(?=:)/, function (match) {
        var user = instance.contacts[_this.FromUserName].MemberList.find(function (member) {
          return member.UserName === match;
        });
        return user ? instance.Contact.getDisplayName(user) : match;
      });
    }

    this.Content = this.Content.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/<br\/>/g, '\n');
    this.Content = (0, _util.convertEmoji)(this.Content);

    return this;
  },
  isSendBy: function isSendBy(contact) {
    return this.FromUserName === contact.UserName;
  },
  getPeerUserName: function getPeerUserName() {
    return this.isSendBySelf ? this.ToUserName : this.FromUserName;
  },
  getDisplayTime: function getDisplayTime() {
    var time = new Date(1e3 * this.CreateTime);
    return time.getHours() + ':' + (0, _util.formatNum)(time.getMinutes(), 2);
  }
};

function MessageFactory(instance) {
  return {
    extend: function extend(messageObj) {
      messageObj = Object.setPrototypeOf(messageObj, messageProto);
      return messageObj.init(instance);
    }
  };
}
//# sourceMappingURL=message.js.map