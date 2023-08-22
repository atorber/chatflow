"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nlp = void 0;
var util_1 = require("./util");
function tokenize(query) {
    return (0, util_1.transferNLP)('TOKENIZE', query);
}
function ner(query) {
    return (0, util_1.transferNLP)('NER', query);
}
function sentiment(query) {
    return (0, util_1.transferNLP)('SENTIMENT', query);
}
function sensitive(query) {
    return (0, util_1.transferNLP)('SENSITIVE', query);
}
exports.nlp = { tokenize: tokenize, ner: ner, sentiment: sentiment, sensitive: sensitive };
