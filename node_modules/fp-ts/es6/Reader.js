/**
 * @since 2.0.0
 */
import { getApplicativeMonoid } from './Applicative';
import { apFirst as apFirst_, apS as apS_, apSecond as apSecond_, getApplySemigroup } from './Apply';
import { bind as bind_, chainFirst as chainFirst_ } from './Chain';
import * as E from './Either';
import { constant, flow, identity, pipe } from './function';
import { bindTo as bindTo_, flap as flap_ } from './Functor';
import * as _ from './internal';
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Reads the current context
 *
 * @category constructors
 * @since 2.0.0
 */
export var ask = function () { return identity; };
/**
 * Projects a value from the global context in a Reader
 *
 * @category constructors
 * @since 2.0.0
 */
export var asks = identity;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Changes the value of the local context during the execution of the action `ma` (similar to `Contravariant`'s
 * `contramap`).
 *
 * @category combinators
 * @since 2.0.0
 */
export var local = function (f) { return function (ma) { return function (r2) {
    return ma(f(r2));
}; }; };
/**
 * Less strict version of [`asksReader`](#asksreader).
 *
 * @category combinators
 * @since 2.11.0
 */
export var asksReaderW = function (f) { return function (r) { return f(r)(r); }; };
/**
 * Effectfully accesses the environment.
 *
 * @category combinators
 * @since 2.11.0
 */
export var asksReader = asksReaderW;
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
/* istanbul ignore next */
var _map = function (fa, f) { return pipe(fa, map(f)); };
/* istanbul ignore next */
var _ap = function (fab, fa) { return pipe(fab, ap(fa)); };
/* istanbul ignore next */
var _chain = function (ma, f) { return pipe(ma, chain(f)); };
var _compose = function (bc, ab) { return pipe(bc, compose(ab)); };
var _promap = function (fea, f, g) { return pipe(fea, promap(f, g)); };
// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 2.0.0
 */
export var map = function (f) { return function (fa) { return function (r) { return f(fa(r)); }; }; };
/**
 * Less strict version of [`ap`](#ap).
 *
 * @category Apply
 * @since 2.8.0
 */
export var apW = function (fa) { return function (fab) { return function (r) { return fab(r)(fa(r)); }; }; };
/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 2.0.0
 */
export var ap = apW;
/**
 * @category Pointed
 * @since 2.0.0
 */
export var of = constant;
/**
 * Less strict version of [`chain`](#chain).
 *
 * @category Monad
 * @since 2.6.0
 */
export var chainW = function (f) { return function (fa) { return function (r) { return f(fa(r))(r); }; }; };
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 2.0.0
 */
export var chain = chainW;
/**
 * Less strict version of [`flatten`](#flatten).
 *
 * @category combinators
 * @since 2.11.0
 */
export var flattenW = 
/*#__PURE__*/
chainW(identity);
/**
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.0.0
 */
export var flatten = flattenW;
/**
 * @category Semigroupoid
 * @since 2.0.0
 */
export var compose = function (ab) { return function (bc) { return flow(ab, bc); }; };
/**
 * @category Profunctor
 * @since 2.0.0
 */
export var promap = function (f, g) { return function (fea) { return function (a) { return g(fea(f(a))); }; }; };
/**
 * @category Category
 * @since 2.0.0
 */
export var id = function () { return identity; };
/**
 * @category Strong
 * @since 2.10.0
 */
export var first = function (pab) { return function (_a) {
    var a = _a[0], c = _a[1];
    return [pab(a), c];
}; };
/**
 * @category Strong
 * @since 2.10.0
 */
export var second = function (pbc) { return function (_a) {
    var a = _a[0], b = _a[1];
    return [a, pbc(b)];
}; };
/**
 * @category Choice
 * @since 2.10.0
 */
export var left = function (pab) { return E.fold(function (a) { return _.left(pab(a)); }, E.right); };
/**
 * @category Choice
 * @since 2.10.0
 */
export var right = function (pbc) { return E.fold(E.left, function (b) { return _.right(pbc(b)); }); };
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
export var URI = 'Reader';
/**
 * @category instances
 * @since 2.7.0
 */
export var Functor = {
    URI: URI,
    map: _map
};
/**
 * Derivable from `Functor`.
 *
 * @category combinators
 * @since 2.10.0
 */
export var flap = 
/*#__PURE__*/
flap_(Functor);
/**
 * @category instances
 * @since 2.10.0
 */
export var Pointed = {
    URI: URI,
    of: of
};
/**
 * @category instances
 * @since 2.10.0
 */
export var Apply = {
    URI: URI,
    map: _map,
    ap: _ap
};
/**
 * Combine two effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
export var apFirst = 
/*#__PURE__*/
apFirst_(Apply);
/**
 * Less strict version of [`apFirst`](#apfirst).
 *
 * @category combinators
 * @since 2.12.0
 */
export var apFirstW = apFirst;
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.0.0
 */
export var apSecond = 
/*#__PURE__*/
apSecond_(Apply);
/**
 * Less strict version of [`apSecond`](#apsecond).
 *
 * @category combinators
 * @since 2.12.0
 */
export var apSecondW = apSecond;
/**
 * @category instances
 * @since 2.7.0
 */
export var Applicative = {
    URI: URI,
    map: _map,
    ap: _ap,
    of: of
};
/**
 * @category instances
 * @since 2.10.0
 */
export var Chain = {
    URI: URI,
    map: _map,
    ap: _ap,
    chain: _chain
};
/**
 * @category instances
 * @since 2.7.0
 */
export var Monad = {
    URI: URI,
    map: _map,
    of: of,
    ap: _ap,
    chain: _chain
};
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.0.0
 */
export var chainFirst = 
/*#__PURE__*/
chainFirst_(Chain);
/**
 * Less strict version of [`chainFirst`](#chainfirst).
 *
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.11.0
 */
export var chainFirstW = chainFirst;
/**
 * @category instances
 * @since 2.7.0
 */
export var Profunctor = {
    URI: URI,
    map: _map,
    promap: _promap
};
/**
 * @category instances
 * @since 2.7.0
 */
export var Category = {
    URI: URI,
    compose: _compose,
    id: id
};
/**
 * @category instances
 * @since 2.8.3
 */
export var Strong = {
    URI: URI,
    map: _map,
    promap: _promap,
    first: first,
    second: second
};
/**
 * @category instances
 * @since 2.8.3
 */
export var Choice = {
    URI: URI,
    map: _map,
    promap: _promap,
    left: left,
    right: right
};
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @since 2.8.0
 */
export var bindTo = 
/*#__PURE__*/
bindTo_(Functor);
/**
 * @since 2.8.0
 */
export var bind = 
/*#__PURE__*/
bind_(Chain);
/**
 * @since 2.8.0
 */
export var bindW = bind;
// -------------------------------------------------------------------------------------
// pipeable sequence S
// -------------------------------------------------------------------------------------
/**
 * @since 2.9.0
 */
export var Do = 
/*#__PURE__*/
of(_.emptyRecord);
/**
 * @since 2.8.0
 */
export var apS = 
/*#__PURE__*/
apS_(Apply);
/**
 * @since 2.8.0
 */
export var apSW = apS;
// -------------------------------------------------------------------------------------
// sequence T
// -------------------------------------------------------------------------------------
/**
 * @since 2.11.0
 */
export var ApT = 
/*#__PURE__*/
of(_.emptyReadonlyArray);
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(Applicative)`.
 *
 * @since 2.11.0
 */
export var traverseReadonlyNonEmptyArrayWithIndex = function (f) { return function (as) { return function (r) {
    var out = [f(0, _.head(as))(r)];
    for (var i = 1; i < as.length; i++) {
        out.push(f(i, as[i])(r));
    }
    return out;
}; }; };
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @since 2.11.0
 */
export var traverseReadonlyArrayWithIndex = function (f) {
    var g = traverseReadonlyNonEmptyArrayWithIndex(f);
    return function (as) { return (_.isNonEmpty(as) ? g(as) : ApT); };
};
/**
 * @since 2.9.0
 */
export var traverseArrayWithIndex = traverseReadonlyArrayWithIndex;
/**
 * @since 2.9.0
 */
export var traverseArray = function (f) { return traverseReadonlyArrayWithIndex(function (_, a) { return f(a); }); };
/**
 * @since 2.9.0
 */
export var sequenceArray = 
/*#__PURE__*/
traverseArray(identity);
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
// tslint:disable: deprecation
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export var reader = {
    URI: URI,
    map: _map,
    of: of,
    ap: _ap,
    chain: _chain,
    promap: _promap,
    compose: _compose,
    id: id,
    first: first,
    second: second,
    left: left,
    right: right
};
/**
 * Use [`getApplySemigroup`](./Apply.ts.html#getapplysemigroup) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export var getSemigroup = 
/*#__PURE__*/
getApplySemigroup(Apply);
/**
 * Use [`getApplicativeMonoid`](./Applicative.ts.html#getapplicativemonoid) instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export var getMonoid = 
/*#__PURE__*/
getApplicativeMonoid(Applicative);
