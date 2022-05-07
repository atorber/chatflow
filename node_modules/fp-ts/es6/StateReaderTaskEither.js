import { apFirst as apFirst_, apS as apS_, apSecond as apSecond_ } from './Apply';
import { bind as bind_, chainFirst as chainFirst_ } from './Chain';
import * as E from './Either';
import { chainEitherK as chainEitherK_, chainOptionK as chainOptionK_, filterOrElse as filterOrElse_, fromEitherK as fromEitherK_, fromOption as fromOption_, fromOptionK as fromOptionK_, fromPredicate as fromPredicate_, chainFirstEitherK as chainFirstEitherK_ } from './FromEither';
import { chainFirstIOK as chainFirstIOK_, chainIOK as chainIOK_, fromIOK as fromIOK_ } from './FromIO';
import { ask as ask_, asks as asks_, chainFirstReaderK as chainFirstReaderK_, chainReaderK as chainReaderK_, fromReaderK as fromReaderK_ } from './FromReader';
import { chainStateK as chainStateK_, fromStateK as fromStateK_, get as get_, gets as gets_, modify as modify_, put as put_ } from './FromState';
import { chainFirstTaskK as chainFirstTaskK_, chainTaskK as chainTaskK_, fromTaskK as fromTaskK_ } from './FromTask';
import { flow, identity, pipe } from './function';
import { bindTo as bindTo_, flap as flap_ } from './Functor';
import * as _ from './internal';
import * as R from './Reader';
import * as RTE from './ReaderTaskEither';
import * as ST from './StateT';
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.0.0
 */
export var left = function (e) { return function () { return RTE.left(e); }; };
/**
 * @category constructors
 * @since 2.0.0
 */
export var right = 
/*#__PURE__*/
ST.of(RTE.Pointed);
/**
 * @category constructors
 * @since 2.0.0
 */
export function rightTask(ma) {
    return fromReaderTaskEither(RTE.rightTask(ma));
}
/**
 * @category constructors
 * @since 2.0.0
 */
export function leftTask(me) {
    return fromReaderTaskEither(RTE.leftTask(me));
}
/**
 * @category constructors
 * @since 2.0.0
 */
export function rightReader(ma) {
    return fromReaderTaskEither(RTE.rightReader(ma));
}
/**
 * @category constructors
 * @since 2.0.0
 */
export function leftReader(me) {
    return fromReaderTaskEither(RTE.leftReader(me));
}
/**
 * @category constructors
 * @since 2.0.0
 */
export function rightIO(ma) {
    return fromReaderTaskEither(RTE.rightIO(ma));
}
/**
 * @category constructors
 * @since 2.0.0
 */
export function leftIO(me) {
    return fromReaderTaskEither(RTE.leftIO(me));
}
/**
 * @category constructors
 * @since 2.0.0
 */
export var rightState = function (sa) {
    return flow(sa, RTE.right);
};
/**
 * @category constructors
 * @since 2.0.0
 */
export var leftState = function (me) { return function (s) { return RTE.left(me(s)[0]); }; };
// -------------------------------------------------------------------------------------
// natural transformations
// -------------------------------------------------------------------------------------
/**
 * @category natural transformations
 * @since 2.0.0
 */
export var fromEither = 
/*#__PURE__*/
E.match(function (e) { return left(e); }, right);
/**
 * @category natural transformations
 * @since 2.11.0
 */
export var fromReader = rightReader;
/**
 * @category natural transformations
 * @since 2.7.0
 */
export var fromIO = rightIO;
/**
 * @category natural transformations
 * @since 2.7.0
 */
export var fromTask = rightTask;
/**
 * @category natural transformations
 * @since 2.10.0
 */
export var fromState = 
/*#__PURE__*/
ST.fromState(RTE.Pointed);
/**
 * @category natural transformations
 * @since 2.0.0
 */
export var fromTaskEither = function (ma) { return fromReaderTaskEither(RTE.fromTaskEither(ma)); };
/**
 * @category natural transformations
 * @since 2.0.0
 */
export var fromIOEither = function (ma) { return fromReaderTaskEither(RTE.fromIOEither(ma)); };
/**
 * @category natural transformations
 * @since 2.0.0
 */
export var fromReaderEither = function (ma) {
    return fromReaderTaskEither(RTE.fromReaderEither(ma));
};
/**
 * @category constructors
 * @since 2.0.0
 */
export var fromReaderTaskEither = 
/*#__PURE__*/
ST.fromF(RTE.Functor);
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Changes the value of the local context during the execution of the action `ma` (similar to `Contravariant`'s
 * `contramap`).
 *
 * @category combinators
 * @since 2.11.0
 */
export var local = function (f) { return function (ma) { return flow(ma, R.local(f)); }; };
/**
 * Less strict version of [`asksStateReaderTaskEither`](#asksstatereadertaskeither).
 *
 * @category combinators
 * @since 2.11.0
 */
export var asksStateReaderTaskEitherW = function (f) { return function (s) { return function (r) { return f(r)(s)(r); }; }; };
/**
 * Effectfully accesses the environment.
 *
 * @category combinators
 * @since 2.11.0
 */
export var asksStateReaderTaskEither = asksStateReaderTaskEitherW;
/**
 * @category combinators
 * @since 2.4.0
 */
export var fromIOEitherK = function (f) { return function () {
    var a = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        a[_i] = arguments[_i];
    }
    return fromIOEither(f.apply(void 0, a));
}; };
/**
 * Less strict version of [`chainIOEitherK`](#chainioeitherk).
 *
 * @category combinators
 * @since 2.6.1
 */
export var chainIOEitherKW = function (f) { return function (ma) { return pipe(ma, chainW(fromIOEitherK(f))); }; };
/**
 * @category combinators
 * @since 2.4.0
 */
export var chainIOEitherK = chainIOEitherKW;
/**
 * @category combinators
 * @since 2.4.0
 */
export var fromTaskEitherK = function (f) { return function () {
    var a = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        a[_i] = arguments[_i];
    }
    return fromTaskEither(f.apply(void 0, a));
}; };
/**
 * Less strict version of [`chainTaskEitherK`](#chaintaskeitherk).
 *
 * @category combinators
 * @since 2.6.1
 */
export var chainTaskEitherKW = function (f) { return function (ma) { return pipe(ma, chainW(fromTaskEitherK(f))); }; };
/**
 * @category combinators
 * @since 2.4.0
 */
export var chainTaskEitherK = chainTaskEitherKW;
/**
 * @category combinators
 * @since 2.4.0
 */
export var fromReaderTaskEitherK = function (f) { return function () {
    var a = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        a[_i] = arguments[_i];
    }
    return fromReaderTaskEither(f.apply(void 0, a));
}; };
/**
 * Less strict version of [`chainReaderTaskEitherK`](#chainreadertaskeitherk).
 *
 * @category combinators
 * @since 2.6.1
 */
export var chainReaderTaskEitherKW = function (f) { return function (ma) { return pipe(ma, chainW(fromReaderTaskEitherK(f))); }; };
/**
 * @category combinators
 * @since 2.4.0
 */
export var chainReaderTaskEitherK = chainReaderTaskEitherKW;
// -------------------------------------------------------------------------------------
// non-pipeables
// -------------------------------------------------------------------------------------
/* istanbul ignore next */
var _map = function (fa, f) { return pipe(fa, map(f)); };
/* istanbul ignore next */
var _ap = function (fab, fa) { return pipe(fab, ap(fa)); };
/* istanbul ignore next */
var _chain = function (ma, f) { return pipe(ma, chain(f)); };
/* istanbul ignore next */
var _alt = function (fa, that) { return function (s) {
    return pipe(fa(s), RTE.alt(function () { return that()(s); }));
}; };
var _bimap = function (fea, f, g) { return function (s) {
    return pipe(fea(s), RTE.bimap(f, function (_a) {
        var a = _a[0], s = _a[1];
        return [g(a), s];
    }));
}; };
var _mapLeft = function (fea, f) { return function (s) { return pipe(fea(s), RTE.mapLeft(f)); }; };
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
export var map = 
/*#__PURE__*/
ST.map(RTE.Functor);
/**
 * Map a pair of functions over the two last type arguments of the bifunctor.
 *
 * @category Bifunctor
 * @since 2.6.2
 */
export var bimap = function (f, g) { return function (fa) {
    return _bimap(fa, f, g);
}; };
/**
 * Map a function over the third type argument of a bifunctor.
 *
 * @category Bifunctor
 * @since 2.6.2
 */
export var mapLeft = function (f) { return function (fa) {
    return _mapLeft(fa, f);
}; };
/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 2.0.0
 */
export var ap = 
/*#__PURE__*/
ST.ap(RTE.Chain);
/**
 * Less strict version of [`ap`](#ap).
 *
 * @category Apply
 * @since 2.8.0
 */
export var apW = ap;
/**
 * @category Pointed
 * @since 2.7.0
 */
export var of = right;
/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 2.0.0
 */
export var chain = 
/*#__PURE__*/
ST.chain(RTE.Chain);
/**
 * Less strict version of [`chain`](#chain).
 *
 * @category Monad
 * @since 2.6.0
 */
export var chainW = chain;
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
 * Less strict version of [`alt`](#alt).
 *
 * @category Alt
 * @since 2.9.0
 */
export var altW = function (that) { return function (fa) { return function (r) {
    return pipe(fa(r), RTE.altW(function () { return that()(r); }));
}; }; };
/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category Alt
 * @since 2.6.2
 */
export var alt = altW;
/**
 * @category MonadThrow
 * @since 2.7.0
 */
export var throwError = left;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
export var URI = 'StateReaderTaskEither';
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
 * @since 2.11.0
 */
export var FromState = {
    URI: URI,
    fromState: fromState
};
/**
 * Get the current state
 *
 * @category constructors
 * @since 2.0.0
 */
export var get = 
/*#__PURE__*/
get_(FromState);
/**
 * Set the state
 *
 * @category constructors
 * @since 2.0.0
 */
export var put = 
/*#__PURE__*/
put_(FromState);
/**
 * Modify the state by applying a function to the current state
 *
 * @category constructors
 * @since 2.0.0
 */
export var modify = 
/*#__PURE__*/
modify_(FromState);
/**
 * Get a value which depends on the current state
 *
 * @category constructors
 * @since 2.0.0
 */
export var gets = 
/*#__PURE__*/
gets_(FromState);
/**
 * @category combinators
 * @since 2.11.0
 */
export var fromStateK = 
/*#__PURE__*/
fromStateK_(FromState);
/**
 * @category combinators
 * @since 2.11.0
 */
export var chainStateK = 
/*#__PURE__*/
chainStateK_(FromState, Chain);
/**
 * @category instances
 * @since 2.10.0
 */
export var Monad = {
    URI: URI,
    map: _map,
    ap: _ap,
    of: of,
    chain: _chain
};
/**
 * @category instances
 * @since 2.10.0
 */
export var MonadIO = {
    URI: URI,
    map: _map,
    ap: _ap,
    of: of,
    chain: _chain,
    fromIO: fromIO
};
/**
 * @category instances
 * @since 2.10.0
 */
export var MonadTask = {
    URI: URI,
    map: _map,
    ap: _ap,
    of: of,
    chain: _chain,
    fromIO: fromIO,
    fromTask: fromTask
};
/**
 * @category instances
 * @since 2.10.0
 */
export var MonadThrow = {
    URI: URI,
    map: _map,
    ap: _ap,
    of: of,
    chain: _chain,
    throwError: throwError
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
 * @since 2.8.0
 */
export var chainFirstW = chainFirst;
/**
 * @category instances
 * @since 2.7.0
 */
export var Bifunctor = {
    URI: URI,
    bimap: _bimap,
    mapLeft: _mapLeft
};
/**
 * @category instances
 * @since 2.7.0
 */
export var Alt = {
    URI: URI,
    map: _map,
    alt: _alt
};
/**
 * @category instances
 * @since 2.11.0
 */
export var FromReader = {
    URI: URI,
    fromReader: fromReader
};
/**
 * Reads the current context.
 *
 * @category constructors
 * @since 2.11.0
 */
export var ask = 
/*#__PURE__*/
ask_(FromReader);
/**
 * Projects a value from the global context in a `ReaderEither`.
 *
 * @category constructors
 * @since 2.11.0
 */
export var asks = 
/*#__PURE__*/
asks_(FromReader);
/**
 * @category combinators
 * @since 2.11.0
 */
export var fromReaderK = 
/*#__PURE__*/
fromReaderK_(FromReader);
/**
 * @category combinators
 * @since 2.11.0
 */
export var chainReaderK = 
/*#__PURE__*/
chainReaderK_(FromReader, Chain);
/**
 * Less strict version of [`chainReaderK`](#chainReaderK).
 *
 * @category combinators
 * @since 2.11.0
 */
export var chainReaderKW = chainReaderK;
/**
 * @category combinators
 * @since 2.11.0
 */
export var chainFirstReaderK = 
/*#__PURE__*/
chainFirstReaderK_(FromReader, Chain);
/**
 * Less strict version of [`chainFirstReaderK`](#chainFirstReaderK).
 *
 * @category combinators
 * @since 2.11.0
 */
export var chainFirstReaderKW = chainFirstReaderK;
/**
 * @category instances
 * @since 2.10.0
 */
export var FromEither = {
    URI: URI,
    fromEither: fromEither
};
/**
 * @category natural transformations
 * @since 2.0.0
 */
export var fromOption = 
/*#__PURE__*/
fromOption_(FromEither);
/**
 * @category combinators
 * @since 2.10.0
 */
export var fromOptionK = 
/*#__PURE__*/
fromOptionK_(FromEither);
/**
 * @category combinators
 * @since 2.10.0
 */
export var chainOptionK = 
/*#__PURE__*/
chainOptionK_(FromEither, Chain);
/**
 * @category combinators
 * @since 2.4.0
 */
export var chainEitherK = 
/*#__PURE__*/
chainEitherK_(FromEither, Chain);
/**
 * Less strict version of [`chainEitherK`](#chaineitherk).
 *
 * @category combinators
 * @since 2.6.1
 */
export var chainEitherKW = chainEitherK;
/**
 * @category combinators
 * @since 2.12.0
 */
export var chainFirstEitherK = 
/*#__PURE__*/
chainFirstEitherK_(FromEither, Chain);
/**
 * Less strict version of [`chainFirstEitherK`](#chainfirsteitherk).
 *
 * @category combinators
 * @since 2.12.0
 */
export var chainFirstEitherKW = chainFirstEitherK;
/**
 * @category constructors
 * @since 2.4.4
 */
export var fromPredicate = 
/*#__PURE__*/
fromPredicate_(FromEither);
/**
 * @category combinators
 * @since 2.4.4
 */
export var filterOrElse = 
/*#__PURE__*/
filterOrElse_(FromEither, Chain);
/**
 * Less strict version of [`filterOrElse`](#filterorelse).
 *
 * @category combinators
 * @since 2.9.0
 */
export var filterOrElseW = filterOrElse;
/**
 * @category combinators
 * @since 2.4.0
 */
export var fromEitherK = 
/*#__PURE__*/
fromEitherK_(FromEither);
/**
 * @category instances
 * @since 2.10.0
 */
export var FromIO = {
    URI: URI,
    fromIO: fromIO
};
/**
 * @category combinators
 * @since 2.10.0
 */
export var fromIOK = 
/*#__PURE__*/
fromIOK_(FromIO);
/**
 * @category combinators
 * @since 2.10.0
 */
export var chainIOK = 
/*#__PURE__*/
chainIOK_(FromIO, Chain);
/**
 * @category combinators
 * @since 2.10.0
 */
export var chainFirstIOK = 
/*#__PURE__*/
chainFirstIOK_(FromIO, Chain);
/**
 * @category instances
 * @since 2.10.0
 */
export var FromTask = {
    URI: URI,
    fromIO: fromIO,
    fromTask: fromTask
};
/**
 * @category combinators
 * @since 2.10.0
 */
export var fromTaskK = 
/*#__PURE__*/
fromTaskK_(FromTask);
/**
 * @category combinators
 * @since 2.10.0
 */
export var chainTaskK = 
/*#__PURE__*/
chainTaskK_(FromTask, Chain);
/**
 * @category combinators
 * @since 2.10.0
 */
export var chainFirstTaskK = 
/*#__PURE__*/
chainFirstTaskK_(FromTask, Chain);
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * Run a computation in the `StateReaderTaskEither` monad, discarding the final state
 *
 * @since 2.8.0
 */
export var evaluate = 
/*#__PURE__*/
ST.evaluate(RTE.Functor);
/**
 * Run a computation in the `StateReaderTaskEither` monad discarding the result
 *
 * @since 2.8.0
 */
export var execute = 
/*#__PURE__*/
ST.execute(RTE.Functor);
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
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(Applicative)`.
 *
 * @since 2.11.0
 */
export var traverseReadonlyNonEmptyArrayWithIndex = function (f) { return function (as) { return function (s) { return function (r) { return function () {
    return _.tail(as).reduce(function (acc, a, i) {
        return acc.then(function (ebs) {
            return _.isLeft(ebs)
                ? acc
                : f(i + 1, a)(ebs.right[1])(r)().then(function (eb) {
                    if (_.isLeft(eb)) {
                        return eb;
                    }
                    var _a = eb.right, b = _a[0], s = _a[1];
                    ebs.right[0].push(b);
                    ebs.right[1] = s;
                    return ebs;
                });
        });
    }, f(0, _.head(as))(s)(r)().then(E.map(function (_a) {
        var b = _a[0], s = _a[1];
        return [[b], s];
    })));
}; }; }; }; };
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Applicative)`.
 *
 * @since 2.11.0
 */
export var traverseReadonlyArrayWithIndex = function (f) {
    var g = traverseReadonlyNonEmptyArrayWithIndex(f);
    return function (as) { return (_.isNonEmpty(as) ? g(as) : of(_.emptyReadonlyArray)); };
};
/**
 * @since 2.9.0
 */
export var traverseArrayWithIndex = traverseReadonlyArrayWithIndex;
/**
 * @since 2.9.0
 */
export var traverseArray = function (f) {
    return traverseReadonlyArrayWithIndex(function (_, a) { return f(a); });
};
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
export var stateReaderTaskEither = {
    URI: URI,
    map: _map,
    of: of,
    ap: _ap,
    chain: _chain,
    bimap: _bimap,
    mapLeft: _mapLeft,
    alt: _alt,
    fromIO: fromIO,
    fromTask: fromTask,
    throwError: throwError
};
/**
 * Use small, specific instances instead.
 *
 * @category instances
 * @since 2.0.0
 * @deprecated
 */
export var stateReaderTaskEitherSeq = {
    URI: URI,
    map: _map,
    of: of,
    ap: _ap,
    chain: _chain,
    bimap: _bimap,
    mapLeft: _mapLeft,
    alt: _alt,
    fromIO: fromIO,
    fromTask: fromTask,
    throwError: throwError
};
/**
 * Use [`evaluate`](#evaluate) instead
 *
 * @since 2.0.0
 * @deprecated
 */
/* istanbul ignore next */
export var evalState = function (fsa, s) {
    return pipe(fsa(s), RTE.map(function (_a) {
        var a = _a[0];
        return a;
    }));
};
/**
 * Use [`execute`](#execute) instead
 *
 * @since 2.0.0
 * @deprecated
 */
/* istanbul ignore next */
export var execState = function (fsa, s) {
    return pipe(fsa(s), RTE.map(function (_a) {
        var _ = _a[0], s = _a[1];
        return s;
    }));
};
/**
 * @since 2.0.0
 * @deprecated
 */
/* istanbul ignore next */
export function run(ma, s, r) {
    return ma(s)(r)();
}
