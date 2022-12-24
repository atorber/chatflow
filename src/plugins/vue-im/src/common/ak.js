/**
 * 工具模块，不依赖第三方代码
 */
var ak = ak || {};

ak.Base_URL = location.host;

/**
 * 工具模块，不依赖第三方代码
 * 包含：类型判断
 */
ak.Utils = {
    /**
     * 是否为JSON字符串
     * @param {String}
     * @return {Boolean}
     */

    isJSON(str) {
        if (typeof str == 'string') {
            try {
                var obj = JSON.parse(str);
                if (str.indexOf('{') > -1) {
                    return true;
                } else {
                    return false;
                }
            } catch (e) {
                return false;
            }
        }
        return false;
    },
    /**
     * 去除字符串首尾两端空格
     * @param {String} str
     * @return {String}
     */
    trim(str) {
        if (str) {
            return str.replace(/(^\s*)|(\s*$)/g, '');
        } else {
            return '';
        }
    },
    /**
     * 脱敏
     * @param {String} value 脱敏的对象
     * @return {String}
     */
    desensitization: function(value) {
        if (value) {
            var valueNew = '';
            const length = value.length;
            valueNew = value
                .split('')
                .map((number, index) => {
                    // 脱敏：从倒数第五位开始向前四位脱敏
                    const indexMin = length - 8;
                    const indexMax = length - 5;

                    if (index >= indexMin && index <= indexMax) {
                        return '*';
                    } else {
                        return number;
                    }
                })
                .join('');
            return valueNew;
        } else {
            return '';
        }
    },

    /**
     * 判断是否Array对象
     * @param {Object} value 判断的对象
     * @return {Boolean}
     */
    isArray: function(value) {
        return toString.call(value) === '[object Array]';
    },

    /**
     * 判断是否日期对象
     * @param {Object} value 判断的对象
     * @return {Boolean}
     */
    isDate: function(value) {
        return toString.call(value) === '[object Date]';
    },

    /**
     * 判断是否Object对象
     * @param {Object} value 判断的对象
     * @return {Boolean}
     */
    isObject: function(value) {
        return toString.call(value) === '[object Object]';
    },

    /**
     * 判断是否为空
     * @param {Object} value 判断的对象
     * @return {Boolean}
     */
    isEmpty: function(value) {
        return value === null || value === undefined || value === '' || (this.isArray(value) && value.length === 0);
    },

    /**
     * 判断是否移动电话
     * @param {Number} value 判断的值
     * @return {Boolean}
     */
    isMobilePhone: function(value) {
        value = Number.parseInt(value);
        // 1)是否非数字
        if (Number.isNaN(value)) {
            return false;
        }

        // 2)时候移动电话
        return /^1[3|4|5|7|8|9|6][0-9]\d{4,8}$/.test(value);
    },

    /**
     * 判断是否为邮箱
     * @param {String} value 判断的值
     * @return {Boolean}
     */
    isEmail: function(value) {
        return /^[a-zA-Z\-_0-9]+@[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+$/.test(value);
    },

    /**
     * 转换服务器请求的对象为Js的对象：包含首字母转换为小写；属性格式转换为Js支持的格式
     * @param {Object} en 服务器的获取的数据对象
     */
    transWebServerObj: function(en) {
        if (toString.call(en) == '[object Array]') {
            for (var i = 0, len = en.length; i < len; i++) {
                ak.Utils.transWebServerObj(en[i]);
            }
        } else {
            for (propertyName in en) {
                /*
                // 1.创建一个小写的首字母属性并赋值：ABC => aBC
                var newPropertyName = propertyName.charAt(0).toLowerCase() + propertyName.substr(1);
                en[newPropertyName] = en[propertyName];
                */
                var tmpName = propertyName;
                // 2.判断此属性是否为数组，若是就执行递归
                if (toString.call(en[tmpName]) == '[object Array]') {
                    for (var i = 0, len = en[tmpName].length; i < len; i++) {
                        ak.Utils.transWebServerObj(en[tmpName][i]); // 数组里的每个对象再依次进行转换
                    }
                } else if (toString.call(en[tmpName]) == '[object Object]') {
                    ak.Utils.transWebServerObj(en[tmpName]); // 若属性的值是一个对象，也要进行转换
                } else {
                    // 3.若不是其他类型，把此属性的值转换为Js的数据格式
                    // 3.1)日期格式：后台为2015-12-08T09:23:23.917 => 2015-12-08 09:23:23
                    if (new RegExp(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/).test(en[propertyName])) {
                        //  en[propertyName] = new RegExp(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/).exec(en[propertyName])[0].replace('T', ' ');

                        //  若为0001年，表示时间为空，就返回''空字符串
                        if (en[propertyName].indexOf('0001') >= 0) {
                            en[propertyName] = '';
                        }
                    } else if (toString.call(en[propertyName]) == '[object Number]' && new RegExp(/\d+[.]\d{3}/).test(en[propertyName])) {
                        // 3.2)溢出的float格式：1.33333 = > 1.33
                        en[propertyName] = en[propertyName].toFixed(2);
                    } else if (en[propertyName] == null) {
                        // 3.3)null值返回空
                        en[propertyName] = '';
                    } else if (
                        ['imgPath', 'loopImgPath', 'clubIcon', 'headImgPath'].indexOf(propertyName) >= 0 &&
                        en[propertyName] &&
                        en[propertyName].length > 0
                    ) {
                        en[propertyName] = ak.Base_URL + en[propertyName].replace('..', '');
                    }
                }
            }
        }
        return en;
    },

    /**
     *设置SessionStorage的值
     * @param key：要存的键
     * @param value ：要存的值
     */
    setSessionStorage: function(key, value) {
        if (this.isObject(value) || this.isArray(value)) {
            value = this.toJsonStr(value);
        }
        sessionStorage[key] = value;
    },

    /**
     *获取SessionStorage的值
     * @param key：存的键
     */
    getSessionStorage: function(key) {
        var rs = sessionStorage[key];
        try {
            if (rs != undefined) {
                var obj = this.toJson(rs);
                rs = obj;
            }
        } catch (error) {}
        return rs;
    },

    /**
     * 清除SessionStorage的值
     * @param key：存的键
     */
    removeSessionStorage: function(key) {
        return sessionStorage.removeItem(key);
    },

    /**
     *设置LocalStorage的值
     * @param key：要存的键
     * @param value ：要存的值
     */
    setLocalStorage: function(key, value) {
        if (this.isObject(value) || this.isArray(value)) {
            value = this.toJsonStr(value);
        }
        localStorage[key] = value;
    },

    /**
     *获取LocalStorage的值
     * @param key：存的键
     */
    getLocalStorage: function(key) {
        var rs = localStorage[key];
        try {
            if (rs != undefined) {
                var obj = this.toJson(rs);
                rs = obj;
            }
        } catch (error) {}
        return rs;
    },

    /**
     * 对传入的时间值进行格式化。后台传入前台的时间有两种个是：Sql时间和.Net时间
     * @param {String|Date} sValue 传入的时间字符串
     * @param {dateFormat | bool} dateFormat  日期格式，日期格式：eg：'Y-m-d H:i:s'
     * @return {String} 2014-03-01 这种格式
     * @example
     * 1) Sql时间格式：2015-02-24T00:00:00
     * 2) .Net时间格式：/Date(1410744626000)/
     */
    getDateTimeStr: function(sValue, dateFormat) {
        if (dateFormat == undefined) {
            dateFormat = 'Y-m-d'; // 默认显示年月日
        }

        var dt;
        // 1.先解析传入的时间对象，
        if (sValue) {
            if (toString.call(sValue) !== '[object Date]') {
                // 不为Date格式，就转换为DateTime类型
                sValue = sValue + '';
                if (sValue.indexOf('T') > 0) {
                    // 1)格式：2015-02-24T00:00:00
                    var timestr = sValue.replace('T', ' ').replace(/-/g, '/'); //=> 2015/02/24 00:00:00
                    dt = new Date(timestr);
                } else if (sValue.indexOf('Date') >= 0) {
                    // 2).Net格式：/Date(1410744626000)/
                    //Convert date type that .NET can bind to DateTime
                    //var date = new Date(parseInt(sValue.substr(6)));
                    var timestr = sValue.toString().replace(/\/Date\((\d+)\)\//gi, '$1'); //
                    dt = new Date(Math.abs(timestr));
                } else {
                    dt = new Date(sValue);
                }
            } else {
                dt = sValue;
            }
        }

        // 2.转换
        // 1)转换成对象 'Y-m-d H:i:s'
        var obj = {}; //返回的对象，包含了 year(年)、month(月)、day(日)
        obj.Y = dt.getFullYear(); //年
        obj.m = dt.getMonth() + 1; //月
        obj.d = dt.getDate(); //日期
        obj.H = dt.getHours();
        obj.i = dt.getMinutes();
        obj.s = dt.getSeconds();
        //2.2单位的月、日都转换成双位
        if (obj.m < 10) {
            obj.m = '0' + obj.m;
        }
        if (obj.d < 10) {
            obj.d = '0' + obj.d;
        }
        if (obj.H < 10) {
            obj.H = '0' + obj.H;
        }
        if (obj.i < 10) {
            obj.i = '0' + obj.i;
        }
        if (obj.s < 10) {
            obj.s = '0' + obj.s;
        }
        // 3.解析
        var rs = dateFormat
            .replace('Y', obj.Y)
            .replace('m', obj.m)
            .replace('d', obj.d)
            .replace('H', obj.H)
            .replace('i', obj.i)
            .replace('s', obj.s);

        return rs;
    },

    /**
     * 把总秒数转换为时分秒
     */
    getSFM: function(seconds, dateFormat) {
        if (dateFormat == undefined) {
            dateFormat = 'H:i:s'; // 默认格式
        }
        var obj = {};
        obj.H = Number.parseInt(seconds / 3600);
        obj.i = Number.parseInt((seconds - obj.H * 3600) / 60);
        obj.s = Number.parseInt(seconds - obj.H * 3600 - obj.i * 60);
        if (obj.H < 10) {
            obj.H = '0' + obj.H;
        }
        if (obj.i < 10) {
            obj.i = '0' + obj.i;
        }
        if (obj.s < 10) {
            obj.s = '0' + obj.s;
        }

        // 3.解析
        var rs = dateFormat
            .replace('H', obj.H)
            .replace('i', obj.i)
            .replace('s', obj.s);
        return rs;
    },

    /**
     * 是否同一天
     */
    isSomeDay: function(dt1, dt2) {
        if (dt1.getFullYear() == dt2.getFullYear() && dt1.getMonth() == dt2.getMonth() && dt1.getDate() == dt2.getDate()) {
            return true;
        }
        return false;
    },

    /**
     * 对象转换为json字符串
     * @param  {jsonObj} jsonObj Json对象
     * @return {jsonStr} Json字符串
     */
    toJsonStr: function(jsonObj) {
        return JSON.stringify(jsonObj);
    },

    /**
     * 讲json字符串转换为json对象
     * @param {String} jsonStr Json对象字符串
     * @return {jsonObj} Json对象
     */
    toJson: function(jsonStr) {
        return JSON.parse(jsonStr);
    },

    /**
     * @private
     */
    getCookieVal: function(offset) {
        var endstr = document.cookie.indexOf(';', offset);
        if (endstr == -1) {
            endstr = document.cookie.length;
        }
        return unescape(document.cookie.substring(offset, endstr));
    },

    /**
     * 获取指定key的cookie
     * @param {String} key cookie的key
     */
    getCookie: function(key) {
        var arg = key + '=',
            alen = arg.length,
            clen = document.cookie.length,
            i = 0,
            j = 0;

        while (i < clen) {
            j = i + alen;
            if (document.cookie.substring(i, j) == arg) {
                return this.getCookieVal(j);
            }
            i = document.cookie.indexOf(' ', i) + 1;
            if (i === 0) {
                break;
            }
        }
        return null;
    },

    /**
     * 设置cookie
     * @param {String} key cookie的key
     * @param {String} value cookie的value
     */
    setCookie: function(key, value) {
        var argv = arguments,
            argc = arguments.length,
            expires = argc > 2 ? argv[2] : null,
            path = argc > 3 ? argv[3] : '/',
            domain = argc > 4 ? argv[4] : null,
            secure = argc > 5 ? argv[5] : false;

        document.cookie =
            key +
            '=' +
            escape(value) +
            (expires === null ? '' : '; expires=' + expires.toGMTString()) +
            (path === null ? '' : '; path=' + path) +
            (domain === null ? '' : '; domain=' + domain) +
            (secure === true ? '; secure' : '');
    },

    /**
     * 是否含有特殊字符
     * @param  {String} value 传入的值
     * @return {Boolean} true 含有特殊符号;false 不含有特殊符号
     */
    isHaveSpecialChar: function(value) {
        var oldLength = value.length;
        var newLength = value.replace(/[`~!@#$%^&*_+=\\{}:"<>?\[\];',.\/~！@#￥%……&*——+『』：“”《》？【】；‘’，。？ \[\]()（）]/g, '').length;
        if (newLength < oldLength) {
            return true;
        }
        return false;
    },

    /**
     * 合并数组内成员的某个对象
     * @param {Array} arr 需要合并的数组
     * @param {String} fieldName 数组成员内的指定字段
     * @param {String} split 分隔符，默认为','
     * @example
     * var arr = [{name:'tom',age:13},{name:'jack',age:13}] => (arr, 'name') => tom,jack
     */
    joinArray: function(arr, fieldName, split) {
        split = split == undefined ? ',' : split;
        var rs = arr
            .map((item) => {
                return item[fieldName];
            })
            .join(split);
        return rs;
    }
};

/**
 * http交互模块
 * 包含：ajax
 */
ak.Http = {
    /**
     * 将`name` - `value`对转换为支持嵌套结构的对象数组
     *
     *     var objects = toQueryObjects('hobbies', ['reading', 'cooking', 'swimming']);
     *
     *     // objects then equals:
     *     [
     *         { name: 'hobbies', value: 'reading' },
     *         { name: 'hobbies', value: 'cooking' },
     *         { name: 'hobbies', value: 'swimming' },
     *     ];
     *
     *     var objects = toQueryObjects('dateOfBirth', {
     *         day: 3,
     *         month: 8,
     *         year: 1987,
     *         extra: {
     *             hour: 4
     *             minute: 30
     *         }
     *     }, true); // Recursive
     *
     *     // objects then equals:
     *     [
     *         { name: 'dateOfBirth[day]', value: 3 },
     *         { name: 'dateOfBirth[month]', value: 8 },
     *         { name: 'dateOfBirth[year]', value: 1987 },
     *         { name: 'dateOfBirth[extra][hour]', value: 4 },
     *         { name: 'dateOfBirth[extra][minute]', value: 30 },
     *     ];
     *
     * @param {String} name
     * @param {object | Array} value
     * @param {boolean} [recursive=false] 是否递归
     * @return {array}
     */
    toQueryObjects: function(name, value, recursive) {
        var objects = [],
            i,
            ln;

        if (ak.Utils.isArray(value)) {
            for (i = 0, ln = value.length; i < ln; i++) {
                if (recursive) {
                    objects = objects.concat(toQueryObjects(name + '[' + i + ']', value[i], true));
                } else {
                    objects.push({
                        name: name,
                        value: value[i]
                    });
                }
            }
        } else if (ak.Utils.isObject(value)) {
            for (i in value) {
                if (value.hasOwnProperty(i)) {
                    if (recursive) {
                        objects = objects.concat(toQueryObjects(name + '[' + i + ']', value[i], true));
                    } else {
                        objects.push({
                            name: name,
                            value: value[i]
                        });
                    }
                }
            }
        } else {
            objects.push({
                name: name,
                value: value
            });
        }

        return objects;
    },

    /**
     * 把对象转换为查询字符串
     * e.g.:
     *     toQueryString({foo: 1, bar: 2}); // returns "foo=1&bar=2"
     *     toQueryString({foo: null, bar: 2}); // returns "foo=&bar=2"
     *     toQueryString({date: new Date(2011, 0, 1)}); // returns "date=%222011-01-01T00%3A00%3A00%22"
     * @param {Object} object 需要转换的对象
     * @param {Boolean} [recursive=false] 是否递归
     * @return {String} queryString
     */
    toQueryString: function(object, recursive) {
        var paramObjects = [],
            params = [],
            i,
            j,
            ln,
            paramObject,
            value;

        for (i in object) {
            if (object.hasOwnProperty(i)) {
                paramObjects = paramObjects.concat(this.toQueryObjects(i, object[i], recursive));
            }
        }

        for (j = 0, ln = paramObjects.length; j < ln; j++) {
            paramObject = paramObjects[j];
            value = paramObject.value;

            if (ak.Utils.isEmpty(value)) {
                value = '';
            } else if (ak.Utils.isDate(value)) {
                value =
                    value.getFullYear() +
                    '-' +
                    Ext.String.leftPad(value.getMonth() + 1, 2, '0') +
                    '-' +
                    Ext.String.leftPad(value.getDate(), 2, '0') +
                    'T' +
                    Ext.String.leftPad(value.getHours(), 2, '0') +
                    ':' +
                    Ext.String.leftPad(value.getMinutes(), 2, '0') +
                    ':' +
                    Ext.String.leftPad(value.getSeconds(), 2, '0');
            }

            params.push(encodeURIComponent(paramObject.name) + '=' + encodeURIComponent(String(value)));
        }

        return params.join('&');
    },

    /**
     * 以get方式请求获取JSON数据
     * @param {Object} opts 配置项，可包含以下成员:
     * @param {String} opts.url 请求地址
     * @param {Object} opts.params 附加的请求参数
     * @param {Boolean} opts.isHideLoading 是否关闭'载入中'提示框，默认false
     * @param {String} opts.loadingTitle '载入中'提示框title，e.g. 提交中、上传中
     * @param {Function} opts.successCallback 成功接收内容时的回调函数
     * @param {Function} opts.failCallback 失败的回调函数
     */
    get: function(opts) {
        if (!opts.isHideLoading) {
            ak.Msg.showLoading(opts.loadingTitle);
        }
        if (opts.url.substr(0, 1) == '/') {
            opts.url = opts.url.substr(1);
        }
        opts.url = ak.Base_URL + opts.url;
        if (opts.params) {
            opts.url = opts.url + '?' + this.toQueryString(opts.params);
        }
        // Jquery、Zepto
        $.getJSON(
            opts.url,
            function(res, status, xhr) {
                ak.Msg.hideLoading();
                if (res.resultCode == '0') {
                    if (opts.successCallback) {
                        opts.successCallback(res);
                    }
                } else {
                    ak.Msg.toast(res.resultText, 'error');
                    if (opts.failCallback) {
                        opts.failCallback(res);
                    }
                }
            },
            'json'
        );
    },

    /**
     * 以get方式请求获取JSON数据
     * @param {Object} opts 配置项，可包含以下成员:
     * @param {String} opts.url 请求地址
     * @param {Object} opts.params 附加的请求参数
     * @param {Boolean} opts.ignoreFail 忽略错误，默认false，不管返回的结果如何，都执行 successCallback
     * @param {Boolean} opts.ignoreEmptyParam 忽略空值，默认true
     * @param {Boolean} opts.isHideLoading 是否关闭'载入中'提示框，默认false
     * @param {String} opts.loadingTitle '载入中'提示框title，e.g. 提交中、上传中
     * @param {Function} opts.successCallback 成功接收内容时的回调函数
     * @param {Function} opts.failCallback 失败的回调函数
     */
    post: function(opts) {
        opts.ignoreFail = opts.ignoreFail == undefined ? false : opts.ignoreFail;
        opts.ignoreEmptyParam = opts.ignoreEmptyParam == undefined ? true : opts.ignoreEmptyParam;
        if (!opts.isHideLoading) {
            ak.Msg.showLoading(opts.loadingTitle);
        }
        if (opts.url.substr(0, 1) == '/') {
            opts.url = opts.url.substr(1);
        }
        opts.url = ak.Base_URL + opts.url; // test

        // 去除params的空值
        if (opts.ignoreEmptyParam) {
            for (var key in opts.params) {
                if (opts.params[key] == undefined || opts.params[key] == '') {
                    delete opts.params[key];
                }
            }
        }
        // Jquery、Zepto
        $.post(
            opts.url,
            opts.params,
            function(res, status, xhr) {
                ak.Msg.hideLoading();
                if (res.resultCode == '0' || opts.ignoreFail) {
                    if (opts.successCallback) {
                        opts.successCallback(res);
                    }
                } else {
                    ak.Msg.toast(res.resultText, 'error');
                    if (opts.failCallback) {
                        opts.failCallback(res);
                    }
                }
            },
            'json'
        );
    },

    /**
     * 上传文件
     * @param {Object} opts 配置项，可包含以下成员:
     * @param {Object} opts.params 上传的参数
     * @param {Object} opts.fileParams 上传文件参数
     * @param {String} opts.url 请求地址
     * @param {Function} opts.successCallback 成功接收内容时的回调函数
     * @param {Function} opts.failCallback 失败的回调函数
     */
    uploadFile: function(opts) {
        // 1.解析url
        if (opts.url.substr(0, 1) == '/') {
            opts.url = opts.url.substr(1);
        }
        opts.url = ak.Base_URL + opts.url;
        if (opts.params) {
            opts.url = opts.url + '?' + this.toQueryString(opts.params);
        }

        // 2.文件参数
        var formData = new FormData();
        for (var key in opts.fileParams) {
            formData.append(key, opts.fileParams[key]);
        }

        // 3.发起ajax
        $.ajax({
                url: opts.url,
                type: 'POST',
                cache: false,
                data: formData,
                processData: false,
                contentType: false,
                dataType: 'json'
            })
            .done(function(res) {
                if (res.resultCode != '0') {
                    ak.Msg.toast(res.resultText, 'error');
                }
                if (opts.successCallback) {
                    opts.successCallback(res);
                }
            })
            .fail(function(res) {
                if (opts.failCallback) {
                    opts.failCallback(res);
                }
            });
    }
};

/**
 * 消息模块
 * 包含：确认框、信息提示框
 */
ak.Msg = {
    /**
     * 提示框
     * msg {string} ：信息内容
     */
    alert: function(msg) {},

    /**
     * 确认框
     * msg {string} ：信息内容
     * callback {function} ：点击'确定'时的回调函数。
     */
    confirm: function(msg, callback) {

    },

    /**
     * 显示正在加载
     * @param {String} title 显示的title
     */
    showLoading: function(title) {

    },

    /**
     * 关闭正在加载
     */
    hideLoading: function() {},

    /**
     * 自动消失的提示框
     * @param {String} msg 信息内容
     */
    toast: function(msg) {}
};

/**
 * 业务相关逻辑
 */
ak.BLL = {};

export default ak;