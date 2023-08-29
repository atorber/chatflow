"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatAibot = exports.chat = void 0;
var util_1 = require("./util");
function chat(query) {
    return (0, util_1.transferNLP)('CHAT', query);
}
exports.chat = chat;
function chatAibot(query) {
    return (0, util_1.transferAIBOT)('AIBOT', query);
}
exports.chatAibot = chatAibot;
