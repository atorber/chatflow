'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDisplayName = undefined;
exports.getUserByUserName = getUserByUserName;
exports.isRoomContact = isRoomContact;
exports.isSpContact = isSpContact;
exports.isPublicContact = isPublicContact;
exports.default = ContactFactory;

var _util = require('../util');

var CONF = (0, _util.getCONF)();

/* Contact Object Example
{
  "Uin": 0,
  "UserName": "",
  "NickName": "",
  "HeadImgUrl": "",
  "ContactFlag": 3,
  "MemberCount": 0,
  "MemberList": [],
  "RemarkName": "",
  "HideInputBarFlag": 0,
  "Sex": 0,
  "Signature": "",
  "VerifyFlag": 8,
  "OwnerUin": 0,
  "PYInitial": "",
  "PYQuanPin": "",
  "RemarkPYInitial": "",
  "RemarkPYQuanPin": "",
  "StarFriend": 0,
  "AppAccountFlag": 0,
  "Statues": 0,
  "AttrStatus": 0,
  "Province": "",
  "City": "",
  "Alias": "Urinxs",
  "SnsFlag": 0,
  "UniFriend": 0,
  "DisplayName": "",
  "ChatRoomId": 0,
  "KeyWord": "gh_",
  "EncryChatRoomId": ""
}
*/
function getUserByUserName(memberList, UserName) {
  if (!memberList.length) return null;

  return memberList.find(function (contact) {
    return contact.UserName === UserName;
  });
}

function _getDisplayName(contact) {
  if (isRoomContact(contact)) {
    if (contact.MemberCount >= 2) {
      return '[群] ' + (contact.RemarkName || contact.DisplayName || contact.NickName || _getDisplayName(contact.MemberList[0]) + '\u3001' + _getDisplayName(contact.MemberList[1]));
    } else {
      return '[群] ' + (contact.RemarkName || contact.DisplayName || contact.NickName || '' + _getDisplayName(contact.MemberList[0]));
    }
  } else {
    return contact.DisplayName || contact.RemarkName || contact.NickName || contact.UserName;
  }
}

exports.getDisplayName = _getDisplayName;
function isRoomContact(contact) {
  return contact.UserName ? /^@@|@chatroom$/.test(contact.UserName) : false;
}

function isSpContact(contact) {
  return CONF.SPECIALUSERS.indexOf(contact.UserName) >= 0;
}

function isPublicContact(contact) {
  return contact.VerifyFlag & CONF.MM_USERATTRVERIFYFALG_BIZ_BRAND;
}

var contactProto = {
  init: function init(instance) {
    // 纠正错误以后保持兼容
    this.OriginalNickName = this.OrignalNickName = this.NickName;
    this.OriginalRemarkName = this.OrignalRemarkName = this.RemarkName;
    this.OriginalDisplayName = this.OrignalDisplayName = this.DisplayName;
    this.NickName = (0, _util.convertEmoji)(this.NickName);
    this.RemarkName = (0, _util.convertEmoji)(this.RemarkName);
    this.DisplayName = (0, _util.convertEmoji)(this.DisplayName);
    this.isSelf = this.UserName === instance.user.UserName;

    return this;
  },
  getDisplayName: function getDisplayName() {
    return _getDisplayName(this);
  },
  canSearch: function canSearch(keyword) {
    if (!keyword) return false;
    keyword = keyword.toUpperCase();

    var isSatisfy = function isSatisfy(key) {
      return (key || '').toUpperCase().indexOf(keyword) >= 0;
    };
    return isSatisfy(this.RemarkName) || isSatisfy(this.RemarkPYQuanPin) || isSatisfy(this.NickName) || isSatisfy(this.PYQuanPin) || isSatisfy(this.Alias) || isSatisfy(this.KeyWord);
  }
};

function ContactFactory(instance) {
  return {
    extend: function extend(contactObj) {
      contactObj = Object.setPrototypeOf(contactObj, contactProto);
      return contactObj.init(instance);
    },
    getUserByUserName: function getUserByUserName(UserName) {
      return instance.contacts[UserName];
    },
    getSearchUser: function getSearchUser(keyword) {
      var users = [];
      for (var key in instance.contacts) {
        if (instance.contacts[key].canSearch(keyword)) {
          users.push(instance.contacts[key]);
        }
      }
      return users;
    },
    isSelf: function isSelf(contact) {
      return contact.isSelf || contact.UserName === instance.user.UserName;
    },
    getDisplayName: _getDisplayName,
    isRoomContact: isRoomContact,
    isPublicContact: isPublicContact,
    isSpContact: isSpContact
  };
}
//# sourceMappingURL=contact.js.map