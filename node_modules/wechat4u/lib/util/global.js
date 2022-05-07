'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assert = exports.isFunction = exports.isStandardBrowserEnv = undefined;
exports.convertEmoji = convertEmoji;
exports.formatNum = formatNum;
exports.getClientMsgId = getClientMsgId;
exports.getDeviceID = getDeviceID;

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug3.default)('util');

var isStandardBrowserEnv = exports.isStandardBrowserEnv = typeof window !== 'undefined' && typeof document !== 'undefined' && typeof document.createElement === 'function';

var isFunction = exports.isFunction = function isFunction(val) {
  return Object.prototype.toString.call(val) === '[object Function]';
};

function convertEmoji(s) {
  return s ? s.replace(/<span.*?class="emoji emoji(.*?)"><\/span>/g, function (a, b) {
    switch (b.toLowerCase()) {
      case '1f639':
        b = '1f602';
        break;
      case '1f64d':
        b = '1f614';
        break;
    }
    try {
      var _s = null;
      if (b.length === 4 || b.length === 5) {
        _s = ['0x' + b];
      } else if (b.length === 8) {
        _s = ['0x' + b.slice(0, 4), '0x' + b.slice(4, 8)];
      } else if (b.length === 10) {
        _s = ['0x' + b.slice(0, 5), '0x' + b.slice(5, 10)];
      } else {
        throw new Error('unknown emoji characters');
      }
      return String.fromCodePoint.apply(null, _s);
    } catch (err) {
      debug(b, err);
      return '*';
    }
  }) : '';
}

function formatNum(num, length) {
  num = (isNaN(num) ? 0 : num).toString();
  var n = length - num.length;

  return n > 0 ? [new Array(n + 1).join('0'), num].join('') : num;
}

var assert = exports.assert = {
  equal: function equal(actual, expected, response) {
    try {
      _assert2.default.equal(actual, expected);
    } catch (e) {
      debug(e);
      delete response.request;
      e.response = response;
      throw e;
    }
  },
  notEqual: function notEqual(actual, expected, response) {
    try {
      _assert2.default.notEqual(actual, expected);
    } catch (e) {
      debug(e);
      delete response.request;
      e.response = response;
      throw e;
    }
  },
  ok: function ok(actual, response) {
    try {
      _assert2.default.ok(actual);
    } catch (e) {
      debug(e);
      delete response.request;
      e.response = response;
      throw e;
    }
  }
};

function getClientMsgId() {
  return (Date.now() + Math.random().toFixed(3)).replace('.', '');
}

function getDeviceID() {
  return 'e' + ('' + Math.random().toFixed(15)).substring(2, 17);
}
//# sourceMappingURL=global.js.map