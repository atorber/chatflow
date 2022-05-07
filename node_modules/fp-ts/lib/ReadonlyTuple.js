"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readonlyTuple = exports.mapLeft = exports.map = exports.Traversable = exports.Foldable = exports.Comonad = exports.Semigroupoid = exports.Bifunctor = exports.flap = exports.Functor = exports.URI = exports.sequence = exports.traverse = exports.reduceRight = exports.foldMap = exports.reduce = exports.duplicate = exports.extract = exports.extend = exports.compose = exports.mapSnd = exports.mapFst = exports.bimap = exports.getChainRec = exports.getMonad = exports.getChain = exports.getApplicative = exports.getApply = exports.swap = exports.snd = exports.fst = void 0;
var function_1 = require("./function");
var Functor_1 = require("./Functor");
// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------
/**
 * @category destructors
 * @since 2.5.0
 */
function fst(ea) {
    return ea[0];
}
exports.fst = fst;
/**
 * @category destructors
 * @since 2.5.0
 */
function snd(ea) {
    return ea[1];
}
exports.snd = snd;
/**
 * @category combinators
 * @since 2.5.0
 */
var swap = function (ea) { return [snd(ea), fst(ea)]; };
exports.swap = swap;
/**
 * @category instances
 * @since 2.5.0
 */
function getApply(S) {
    return {
        URI: exports.URI,
        _E: undefined,
        map: _map,
        ap: function (fab, fa) { return [fst(fab)(fst(fa)), S.concat(snd(fab), snd(fa))]; }
    };
}
exports.getApply = getApply;
var of = function (M) { return function (a) {
    return [a, M.empty];
}; };
/**
 * @category instances
 * @since 2.5.0
 */
function getApplicative(M) {
    var A = getApply(M);
    return {
        URI: exports.URI,
        _E: undefined,
        map: A.map,
        ap: A.ap,
        of: of(M)
    };
}
exports.getApplicative = getApplicative;
/**
 * @category instances
 * @since 2.5.0
 */
function getChain(S) {
    var A = getApply(S);
    return {
        URI: exports.URI,
        _E: undefined,
        map: A.map,
        ap: A.ap,
        chain: function (ma, f) {
            var _a = f(fst(ma)), b = _a[0], s = _a[1];
            return [b, S.concat(snd(ma), s)];
        }
    };
}
exports.getChain = getChain;
/**
 * @category instances
 * @since 2.5.0
 */
function getMonad(M) {
    var C = getChain(M);
    return {
        URI: exports.URI,
        _E: undefined,
        map: C.map,
        ap: C.ap,
        chain: C.chain,
        of: of(M)
    };
}
exports.getMonad = getMonad;
/**
 * @category instances
 * @since 2.5.0
 */
function getChainRec(M) {
    var chainRec = function (a, f) {
        var result = f(a);
        var acc = M.empty;
        var s = fst(result);
        while (s._tag === 'Left') {
            acc = M.concat(acc, snd(result));
            result = f(s.left);
            s = fst(result);
        }
        return [s.right, M.concat(acc, snd(result))];
    };
    var C = getChain(M);
    return {
        URI: exports.URI,
        _E: undefined,
        map: C.map,
        ap: C.ap,
        chain: C.chain,
        chainRec: chainRec
    };
}
exports.getChainRec = getChainRec;
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
/* istanbul ignore next */
var _compose = function (bc, ab) { return function_1.pipe(bc, exports.compose(ab)); };
/* istanbul ignore next */
var _map = function (fa, f) { return function_1.pipe(fa, exports.mapFst(f)); };
/* istanbul ignore next */
var _bimap = function (fa, f, g) { return function_1.pipe(fa, exports.bimap(f, g)); };
/* istanbul ignore next */
var _mapLeft = function (fa, f) { return function_1.pipe(fa, exports.mapSnd(f)); };
/* istanbul ignore next */
var _extend = function (wa, f) { return function_1.pipe(wa, exports.extend(f)); };
/* istanbul ignore next */
var _reduce = function (fa, b, f) { return function_1.pipe(fa, exports.reduce(b, f)); };
/* istanbul ignore next */
var _foldMap = function (M) {
    var foldMapM = exports.foldMap(M);
    return function (fa, f) { return function_1.pipe(fa, foldMapM(f)); };
};
/* istanbul ignore next */
var _reduceRight = function (fa, b, f) { return function_1.pipe(fa, exports.reduceRight(b, f)); };
/* istanbul ignore next */
var _traverse = function (F) {
    var traverseF = exports.traverse(F);
    return function (ta, f) { return function_1.pipe(ta, traverseF(f)); };
};
// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------
/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category Bifunctor
 * @since 2.5.0
 */
var bimap = function (f, g) { return function (fa) { return [g(fst(fa)), f(snd(fa))]; }; };
exports.bimap = bimap;
/**
 * Map a function over the first component of a `ReadonlyTuple`.
 *
 * This is the `map` operation of the `Functor` instance.
 *
 * @category Functor
 * @since 2.10.0
 */
var mapFst = function (f) { return function (fa) { return [
    f(fst(fa)),
    snd(fa)
]; }; };
exports.mapFst = mapFst;
/**
 * Map a function over the second component of a `ReadonlyTuple`.
 *
 * This is the `mapLeft` operation of the `Bifunctor` instance.
 *
 * @category Bifunctor
 * @since 2.10.0
 */
var mapSnd = function (f) { return function (fa) { return [
    fst(fa),
    f(snd(fa))
]; }; };
exports.mapSnd = mapSnd;
/**
 * @category Semigroupoid
 * @since 2.5.0
 */
var compose = function (ab) { return function (bc) { return [
    fst(bc),
    snd(ab)
]; }; };
exports.compose = compose;
/**
 * @category Extend
 * @since 2.5.0
 */
var extend = function (f) { return function (wa) { return [f(wa), snd(wa)]; }; };
exports.extend = extend;
/**
 * @category Extract
 * @since 2.6.2
 */
exports.extract = fst;
/**
 * Derivable from `Extend`.
 *
 * @category combinators
 * @since 2.5.0
 */
exports.duplicate = 
/*#__PURE__*/
exports.extend(function_1.identity);
/**
 * @category Foldable
 * @since 2.5.0
 */
var reduce = function (b, f) { return function (fa) {
    return f(b, fst(fa));
}; };
exports.reduce = reduce;
/**
 * @category Foldable
 * @since 2.5.0
 */
var foldMap = function () {
    return function (f) { return function (fa) { return f(fst(fa)); }; };
};
exports.foldMap = foldMap;
/**
 * @category Foldable
 * @since 2.5.0
 */
var reduceRight = function (b, f) { return function (fa) {
    return f(fst(fa), b);
}; };
exports.reduceRight = reduceRight;
/**
 * @since 2.6.3
 */
var traverse = function (F) {
    return function (f) { return function (ta) { return F.map(f(fst(ta)), function (b) { return [b, snd(ta)]; }); }; };
};
exports.traverse = traverse;
/**
 * @since 2.6.3
 */
var sequence = function (F) { return function (fas) {
    return F.map(fst(fas), function (a) { return [a, snd(fas)]; });
}; };
exports.sequence = sequence;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.5.0
 */
exports.URI = 'ReadonlyTuple';
/**
 * @category instances
 * @since 2.7.0
 */
exports.Functor = {
    URI: exports.URI,
    map: _map
};
/**
 * Derivable from `Functor`.
 *
 * @category combinators
 * @since 2.10.0
 */
exports.flap = 
/*#__PURE__*/
Functor_1.flap(exports.Functor);
/**
 * @category instances
 * @since 2.7.0
 */
exports.Bifunctor = {
    URI: exports.URI,
    bimap: _bimap,
    mapLeft: _mapLeft
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Semigroupoid = {
    URI: exports.URI,
    compose: _compose
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Comonad = {
    URI: exports.URI,
    map: _map,
    extend: _extend,
    extract: exports.extract
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Foldable = {
    URI: exports.URI,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight
};
/**
 * @category instances
 * @since 2.7.0
 */
exports.Traversable = {
    URI: exports.URI,
    map: _map,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: exports.sequence
};
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`mapFst`](#mapfst) instead.
 *
 * @since 2.5.0
 * @deprecated
 */
exports.map = exports.mapFst;
/**
 * Use [`mapSnd`](#mapsnd) instead.
 *
 * @since 2.5.0
 * @deprecated
 */
exports.mapLeft = exports.mapSnd;
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.5.0
 * @deprecated
 */
exports.readonlyTuple = {
    URI: exports.URI,
    compose: _compose,
    map: _map,
    bimap: _bimap,
    mapLeft: _mapLeft,
    extract: exports.extract,
    extend: _extend,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence: exports.sequence
};
