"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilterableComposition = exports.partitionMap = exports.partition = exports.filterMap = exports.filter = void 0;
/**
 * `Filterable` represents data structures which can be _partitioned_/_filtered_.
 *
 * Adapted from https://github.com/LiamGoodacre/purescript-filterable/blob/master/src/Data/Filterable.purs
 *
 * @since 2.0.0
 */
var Compactable_1 = require("./Compactable");
var function_1 = require("./function");
var Functor_1 = require("./Functor");
var Option_1 = require("./Option");
var Predicate_1 = require("./Predicate");
var Separated_1 = require("./Separated");
function filter(F, G) {
    return function (predicate) { return function (fga) { return F.map(fga, function (ga) { return G.filter(ga, predicate); }); }; };
}
exports.filter = filter;
function filterMap(F, G) {
    return function (f) { return function (fga) { return F.map(fga, function (ga) { return G.filterMap(ga, f); }); }; };
}
exports.filterMap = filterMap;
function partition(F, G) {
    var _filter = filter(F, G);
    return function (predicate) {
        var left = _filter(Predicate_1.not(predicate));
        var right = _filter(predicate);
        return function (fgb) { return Separated_1.separated(left(fgb), right(fgb)); };
    };
}
exports.partition = partition;
function partitionMap(F, G) {
    var _filterMap = filterMap(F, G);
    return function (f) { return function (fga) {
        return Separated_1.separated(function_1.pipe(fga, _filterMap(function (a) { return Option_1.getLeft(f(a)); })), function_1.pipe(fga, _filterMap(function (a) { return Option_1.getRight(f(a)); })));
    }; };
}
exports.partitionMap = partitionMap;
/** @deprecated */
function getFilterableComposition(F, G) {
    var map = Functor_1.getFunctorComposition(F, G).map;
    var _compact = Compactable_1.compact(F, G);
    var _separate = Compactable_1.separate(F, G, G);
    var _filter = filter(F, G);
    var _filterMap = filterMap(F, G);
    var _partition = partition(F, G);
    var _partitionMap = partitionMap(F, G);
    return {
        map: map,
        compact: _compact,
        separate: _separate,
        filter: function (fga, f) { return function_1.pipe(fga, _filter(f)); },
        filterMap: function (fga, f) { return function_1.pipe(fga, _filterMap(f)); },
        partition: function (fga, p) { return function_1.pipe(fga, _partition(p)); },
        partitionMap: function (fga, f) { return function_1.pipe(fga, _partitionMap(f)); }
    };
}
exports.getFilterableComposition = getFilterableComposition;
