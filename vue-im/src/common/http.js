import Vue from 'vue';
import axios from 'axios';

var axiosInstance = axios.create({
    baseURL: location.origin.replace(/:\d+/, ':3000'),
    timeout: 1000 * 5
});

axiosInstance.interceptors.request.use(
    function(config) {
        // Do something before request is sent
        return config;
    },
    function(error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

/**
 * http请求响应处理函数
 */
var httpResponseHandle = function() {
    var self = this;
    if (self.res.code == '0') {
        self.successCallback && self.successCallback(self.res.data);
    } else {
        self.failCallback && self.failCallback(self.res.data);
    }
};

var http = {
    /**
     * 以get方式请求获取JSON数据
     * @param {Object} opts 配置项，可包含以下成员:
     * @param {String} opts.url 请求地址
     * @param {Object} opts.params 附加的请求参数
     * @param {Function} opts.successCallback 成功接收内容时的回调函数
     */
    get: function(opts) {
        if (opts.params) {
            opts.url = opts.url + '?' + this.toQueryString(opts.params);
        }
        axiosInstance
            .get(opts.url, { params: opts.params })
            .then(function(res) {
                opts.res = res.data;
                httpResponseHandle.call(opts);
            })
            .catch(function(err) {});
    },

    /**
     * 以get方式请求获取JSON数据
     * @param {Object} opts 配置项，可包含以下成员:
     * @param {String} opts.url 请求地址
     * @param {Object} opts.params 附加的请求参数
     * @param {Function} opts.successCallback 成功接收内容时的回调函数
     */
    post: function(opts) {
        axiosInstance
            .post(opts.url, opts.params)
            .then(function(res) {
                opts.res = res.data;
                httpResponseHandle.call(opts);
            })
            .catch(function(err) {});
    },

    /**
     * 上传文件
     * @param {Object} opts 配置项，可包含以下成员:
     * @param {String} opts.url 请求地址
     * @param {Object} opts.params 上传的参数
     * @param {Function} opts.successCallback 成功接收内容时的回调函数
     */
    uploadFile: function(opts) {
        axiosInstance
            .post('/upload', opts.params, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(function(res) {
                opts.res = res.data;
                httpResponseHandle.call(opts);
            })
            .catch(function() {});
    }
};

export default http;
