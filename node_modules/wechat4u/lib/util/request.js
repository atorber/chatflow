'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Request = Request;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _global = require('./global');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getPgv = function getPgv(c) {
  return (c || '') + Math.round(2147483647 * (Math.random() || 0.5)) * (+new Date() % 1E10);
};

function Request(defaults) {
  var _this = this;

  defaults = defaults || {};
  defaults.headers = defaults.headers || {};
  if (!_global.isStandardBrowserEnv) {
    defaults.headers['user-agent'] = defaults.headers['user-agent'] || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36';
    defaults.headers['connection'] = defaults.headers['connection'] || 'close';
  }

  defaults.timeout = 1000 * 60;
  defaults.httpAgent = false;
  defaults.httpsAgent = false;

  this.axios = _axios2.default.create(defaults);
  if (!_global.isStandardBrowserEnv) {
    this.Cookie = defaults.Cookie || {};
    this.Cookie['pgv_pvi'] = getPgv();
    this.Cookie['pgv_si'] = getPgv('s');
    this.axios.interceptors.request.use(function (config) {
      config.headers['cookie'] = Object.keys(_this.Cookie).map(function (key) {
        return key + '=' + _this.Cookie[key];
      }).join('; ');
      return config;
    }, function (err) {
      return Promise.reject(err);
    });
    this.axios.interceptors.response.use(function (res) {
      var setCookie = res.headers['set-cookie'];
      if (setCookie) {
        setCookie.forEach(function (item) {
          var pm = item.match(/^(.+?)\s?\=\s?(.+?);/);
          if (pm) {
            _this.Cookie[pm[1]] = pm[2];
          }
        });
      }
      return res;
    }, function (err) {
      if (err && err.response) {
        delete err.response.request;
        delete err.response.config;
      }
      return Promise.reject(err);
    });
  }

  this.request = function (options) {
    return _this.axios.request(options);
  };

  return this.request;
}
//# sourceMappingURL=request.js.map