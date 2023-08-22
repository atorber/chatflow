"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncodingAESKey = exports.TOKEN = exports.auth = void 0;
var TOKEN = '';
exports.TOKEN = TOKEN;
var EncodingAESKey = '';
exports.EncodingAESKey = EncodingAESKey;
function auth(opt) {
    exports.TOKEN = TOKEN = opt.TOKEN;
    exports.EncodingAESKey = EncodingAESKey = opt.EncodingAESKey;
}
exports.auth = auth;
