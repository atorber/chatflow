"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zero = exports.Alt = exports.chainFirst = exports.Chain = exports.ApplicativeSeq = exports.ApplySeq = exports.ApplicativePar = exports.apSecond = exports.apFirst = exports.ApplyPar = exports.Pointed = exports.flap = exports.Functor = exports.partitionMap = exports.partition = exports.filterMap = exports.filter = exports.separate = exports.compact = exports.none = exports.zero = exports.altW = exports.alt = exports.flatten = exports.chain = exports.of = exports.ap = exports.map = exports.chainOptionK = exports.fromOptionK = exports.chainNullableK = exports.fromNullableK = exports.tryCatchK = exports.tryCatch = exports.fromNullable = exports.getOrElseW = exports.getOrElse = exports.foldW = exports.matchEW = exports.fold = exports.matchE = exports.matchW = exports.match = exports.fromTaskEither = exports.fromTask = exports.fromIO = exports.fromEither = exports.fromOption = exports.fromPredicate = exports.some = void 0;
exports.sequenceSeqArray = exports.traverseSeqArray = exports.traverseSeqArrayWithIndex = exports.sequenceArray = exports.traverseArray = exports.traverseArrayWithIndex = exports.traverseReadonlyArrayWithIndexSeq = exports.traverseReadonlyNonEmptyArrayWithIndexSeq = exports.traverseReadonlyArrayWithIndex = exports.traverseReadonlyNonEmptyArrayWithIndex = exports.ApT = exports.apS = exports.bind = exports.bindTo = exports.Do = exports.chainFirstTaskK = exports.chainTaskK = exports.fromTaskK = exports.FromTask = exports.chainFirstEitherK = exports.chainEitherK = exports.fromEitherK = exports.FromEither = exports.chainFirstIOK = exports.chainIOK = exports.fromIOK = exports.FromIO = exports.Filterable = exports.Compactable = exports.MonadTask = exports.MonadIO = exports.Monad = exports.Alternative = exports.guard = void 0;
var Apply_1 = require("./Apply");
var Chain_1 = require("./Chain");
var Compactable_1 = require("./Compactable");
var Filterable_1 = require("./Filterable");
var FromEither_1 = require("./FromEither");
var FromIO_1 = require("./FromIO");
var FromTask_1 = require("./FromTask");
var function_1 = require("./function");
var Functor_1 = require("./Functor");
var _ = __importStar(require("./internal"));
var O = __importStar(require("./Option"));
var OT = __importStar(require("./OptionT"));
var T = __importStar(require("./Task"));
var Zero_1 = require("./Zero");
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.10.0
 */
exports.some = 
/*#__PURE__*/
OT.some(T.Pointed);
/**
 * @category constructors
 * @since 2.10.0
 */
exports.fromPredicate = 
/*#__PURE__*/
OT.fromPredicate(T.Pointed);
// -------------------------------------------------------------------------------------
// natural transformations
// -------------------------------------------------------------------------------------
/**
 * @category natural transformations
 * @since 2.10.0
 */
exports.fromOption = T.of;
/**
 * @category natural transformations
 * @since 2.10.0
 */
exports.fromEither = 
/*#__PURE__*/
OT.fromEither(T.Pointed);
/**
 * @category natural transformations
 * @since 2.10.0
 */
var fromIO = function (ma) { return exports.fromTask(T.fromIO(ma)); };
exports.fromIO = fromIO;
/**
 * @category natural transformations
 * @since 2.10.0
 */
exports.fromTask = 
/*#__PURE__*/
OT.fromF(T.Functor);
/**
 * @category natural transformations
 * @since 2.11.0
 */
exports.fromTaskEither = 
/*#__PURE__*/
T.map(O.fromEither);
// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------
/**
 * @category destructors
 * @since 2.10.0
 */
exports.match = 
/*#__PURE__*/
OT.match(T.Functor);
/**
 * Less strict version of [`match`](#match).
 *
 * @category destructors
 * @since 2.10.0
 */
exports.matchW = exports.match;
/**
 * @category destructors
 * @since 2.10.0
 */
exports.matchE = 
/*#__PURE__*/
OT.matchE(T.Chain);
/**
 * Alias of [`matchE`](#matche).
 *
 * @category destructors
 * @since 2.10.0
 */
exports.fold = exports.matchE;
/**
 * Less strict version of [`matchE`](#matche).
 *
 * @category destructors
 * @since 2.10.0
 */
exports.matchEW = exports.matchE;
/**
 * Alias of [`matchEW`](#matchew).
 *
 * @category destructors
 * @since 2.10.0
 */
exports.foldW = exports.matchEW;
/**
 * @category destructors
 * @since 2.10.0
 */
exports.getOrElse = 
/*#__PURE__*/
OT.getOrElse(T.Monad);
/**
 * Less strict version of [`getOrElse`](#getorelse).
 *
 * @category destructors
 * @since 2.10.0
 */
exports.getOrElseW = exports.getOrElse;
// -------------------------------------------------------------------------------------
// interop
// -------------------------------------------------------------------------------------
/**
 * @category interop
 * @since 2.10.0
 */
exports.fromNullable = 
/*#__PURE__*/
OT.fromNullable(T.Pointed);
/**
 * Transforms a `Promise` that may reject to a `Promise` that never rejects and returns an `Option` instead.
 *
 * See also [`tryCatchK`](#trycatchk).
 *
 * @category interop
 * @since 2.10.0
 */
var tryCatch = function (f) { return function () { return __awaiter(void 0, void 0, void 0, function () {
    var reason_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, f().then(_.some)];
            case 1: return [2 /*return*/, _a.sent()];
            case 2:
                reason_1 = _a.sent();
                return [2 /*return*/, _.none];
            case 3: return [2 /*return*/];
        }
    });
}); }; };
exports.tryCatch = tryCatch;
/**
 * Converts a function returning a `Promise` to one returning a `TaskOption`.
 *
 * @category interop
 * @since 2.10.0
 */
var tryCatchK = function (f) { return function () {
    var a = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        a[_i] = arguments[_i];
    }
    return exports.tryCatch(function () { return f.apply(void 0, a); });
}; };
exports.tryCatchK = tryCatchK;
/**
 * @category interop
 * @since 2.10.0
 */
exports.fromNullableK = 
/*#__PURE__*/
OT.fromNullableK(T.Pointed);
/**
 * @category interop
 * @since 2.10.0
 */
exports.chainNullableK = 
/*#__PURE__*/
OT.chainNullableK(T.Monad);
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @category combinators
 * @since 2.10.0
 */
exports.fromOptionK = 
/*#__PURE__*/
OT.fromOptionK(T.Pointed);
/**
 * @category combinators
 * @since 2.10.0
 */
exports.chainOptionK = 
/*#__PURE__*/
OT.chainOptionK(T.Monad);
// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 2.10.0
 */
exports.map = 
/*#__PURE__*/
OT.map(T.Functor);
/**
 * @category Apply
 * @since 2.10.0
 */
exports.ap = 
/*#__PURE__*/
OT.ap(T.ApplyPar);
/**
 * @category Pointed
 * @since 2.10.0
 */
exports.of = exports.some;
/**
 * @category Monad
 * @since 2.10.0
 */
exports.chain = 
/*#__PURE__*/
OT.chain(T.Monad);
/**
 * Derivable from `Chain`.
 *
 * @category combinators
 * @since 2.10.0
 */
exports.flatten = 
/*#__PURE__*/
exports.chain(function_1.identity);
/**
 * @category Alt
 * @since 2.10.0
 */
exports.alt = 
/*#__PURE__*/
OT.alt(T.Monad);
/**
 * Less strict version of [`alt`](#alt).
 *
 * @category Alt
 * @since 2.10.0
 */
exports.altW = exports.alt;
/**
 * @category Zero
 * @since 2.10.0
 */
exports.zero = 
/*#__PURE__*/
OT.zero(T.Pointed);
/**
 * @category constructors
 * @since 2.10.0
 */
exports.none = 
/*#__PURE__*/
exports.zero();
/**
 * @category Compactable
 * @since 2.10.0
 */
exports.compact = 
/*#__PURE__*/
Compactable_1.compact(T.Functor, O.Compactable);
/**
 * @category Compactable
 * @since 2.10.0
 */
exports.separate = 
/*#__PURE__*/
Compactable_1.separate(T.Functor, O.Compactable, O.Functor);
/**
 * @category Filterable
 * @since 2.10.0
 */
exports.filter = 
/*#__PURE__*/
Filterable_1.filter(T.Functor, O.Filterable);
/**
 * @category Filterable
 * @since 2.10.0
 */
exports.filterMap = 
/*#__PURE__*/
Filterable_1.filterMap(T.Functor, O.Filterable);
/**
 * @category Filterable
 * @since 2.10.0
 */
exports.partition = 
/*#__PURE__*/
Filterable_1.partition(T.Functor, O.Filterable);
/**
 * @category Filterable
 * @since 2.10.0
 */
exports.partitionMap = 
/*#__PURE__*/
Filterable_1.partitionMap(T.Functor, O.Filterable);
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
var _map = function (fa, f) { return function_1.pipe(fa, exports.map(f)); };
var _ap = function (fab, fa) { return function_1.pipe(fab, exports.ap(fa)); };
/* istanbul ignore next */
var _chain = function (ma, f) { return function_1.pipe(ma, exports.chain(f)); };
/* istanbul ignore next */
var _alt = function (fa, that) { return function_1.pipe(fa, exports.alt(that)); };
/* istanbul ignore next */
var _filter = function (fa, predicate) {
    return function_1.pipe(fa, exports.filter(predicate));
};
/* istanbul ignore next */
var _filterMap = function (fa, f) { return function_1.pipe(fa, exports.filterMap(f)); };
/* istanbul ignore next */
var _partition = function (fa, predicate) {
    return function_1.pipe(fa, exports.partition(predicate));
};
/* istanbul ignore next */
var _partitionMap = function (fa, f) { return function_1.pipe(fa, exports.partitionMap(f)); };
/**
 * @category instances
 * @since 2.10.0
 */
var URI = 'TaskOption';
/**
 * @category instances
 * @since 2.10.0
 */
exports.Functor = {
    URI: URI,
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
 * @since 2.10.0
 */
exports.Pointed = {
    URI: URI,
    of: exports.of
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.ApplyPar = {
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
 * @since 2.10.0
 */
exports.apFirst = 
/*#__PURE__*/
Apply_1.apFirst(exports.ApplyPar);
/**
 * Combine two effectful actions, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 2.10.0
 */
exports.apSecond = 
/*#__PURE__*/
Apply_1.apSecond(exports.ApplyPar);
/**
 * @category instances
 * @since 2.10.0
 */
exports.ApplicativePar = {
    URI: URI,
    map: _map,
    ap: _ap,
    of: exports.of
};
var _apSeq = function (fab, fa) {
    return function_1.pipe(fab, exports.chain(function (f) { return function_1.pipe(fa, exports.map(f)); }));
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.ApplySeq = {
    URI: URI,
    map: _map,
    ap: _apSeq
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.ApplicativeSeq = {
    URI: URI,
    map: _map,
    ap: _apSeq,
    of: exports.of
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.Chain = {
    URI: URI,
    map: _map,
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
 * @since 2.10.0
 */
exports.chainFirst = 
/*#__PURE__*/
Chain_1.chainFirst(exports.Chain);
/**
 * @category instances
 * @since 2.10.0
 */
exports.Alt = {
    URI: URI,
    map: _map,
    alt: _alt
};
/**
 * @category instances
 * @since 2.11.0
 */
exports.Zero = {
    URI: URI,
    zero: exports.zero
};
/**
 * @category constructors
 * @since 2.11.0
 */
exports.guard = 
/*#__PURE__*/
Zero_1.guard(exports.Zero, exports.Pointed);
/**
 * @category instances
 * @since 2.10.0
 */
exports.Alternative = {
    URI: URI,
    map: _map,
    ap: _ap,
    of: exports.of,
    alt: _alt,
    zero: exports.zero
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.Monad = {
    URI: URI,
    map: _map,
    ap: _ap,
    of: exports.of,
    chain: _chain
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.MonadIO = {
    URI: URI,
    map: _map,
    ap: _ap,
    of: exports.of,
    chain: _chain,
    fromIO: exports.fromIO
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.MonadTask = {
    URI: URI,
    map: _map,
    ap: _ap,
    of: exports.of,
    chain: _chain,
    fromIO: exports.fromIO,
    fromTask: exports.fromTask
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.Compactable = {
    URI: URI,
    compact: exports.compact,
    separate: exports.separate
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.Filterable = {
    URI: URI,
    map: _map,
    compact: exports.compact,
    separate: exports.separate,
    filter: _filter,
    filterMap: _filterMap,
    partition: _partition,
    partitionMap: _partitionMap
};
/**
 * @category instances
 * @since 2.10.0
 */
exports.FromIO = {
    URI: URI,
    fromIO: exports.fromIO
};
/**
 * @category combinators
 * @since 2.10.0
 */
exports.fromIOK = 
/*#__PURE__*/
FromIO_1.fromIOK(exports.FromIO);
/**
 * @category combinators
 * @since 2.10.0
 */
exports.chainIOK = 
/*#__PURE__*/
FromIO_1.chainIOK(exports.FromIO, exports.Chain);
/**
 * @category combinators
 * @since 2.10.0
 */
exports.chainFirstIOK = 
/*#__PURE__*/
FromIO_1.chainFirstIOK(exports.FromIO, exports.Chain);
/**
 * @category instances
 * @since 2.11.0
 */
exports.FromEither = {
    URI: URI,
    fromEither: exports.fromEither
};
/**
 * @category combinators
 * @since 2.12.0
 */
exports.fromEitherK = 
/*#__PURE__*/
FromEither_1.fromEitherK(exports.FromEither);
/**
 * @category combinators
 * @since 2.12.0
 */
exports.chainEitherK = 
/*#__PURE__*/
FromEither_1.chainEitherK(exports.FromEither, exports.Chain);
/**
 * @category combinators
 * @since 2.12.0
 */
exports.chainFirstEitherK = 
/*#__PURE__*/
FromEither_1.chainFirstEitherK(exports.FromEither, exports.Chain);
/**
 * @category instances
 * @since 2.10.0
 */
exports.FromTask = {
    URI: URI,
    fromIO: exports.fromIO,
    fromTask: exports.fromTask
};
/**
 * @category combinators
 * @since 2.10.0
 */
exports.fromTaskK = 
/*#__PURE__*/
FromTask_1.fromTaskK(exports.FromTask);
/**
 * @category combinators
 * @since 2.10.0
 */
exports.chainTaskK = 
/*#__PURE__*/
FromTask_1.chainTaskK(exports.FromTask, exports.Chain);
/**
 * @category combinators
 * @since 2.10.0
 */
exports.chainFirstTaskK = 
/*#__PURE__*/
FromTask_1.chainFirstTaskK(exports.FromTask, exports.Chain);
// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------
/**
 * @since 2.10.0
 */
exports.Do = 
/*#__PURE__*/
exports.of(_.emptyRecord);
/**
 * @since 2.10.0
 */
exports.bindTo = 
/*#__PURE__*/
Functor_1.bindTo(exports.Functor);
/**
 * @since 2.10.0
 */
exports.bind = 
/*#__PURE__*/
Chain_1.bind(exports.Chain);
// -------------------------------------------------------------------------------------
// sequence S
// -------------------------------------------------------------------------------------
/**
 * @since 2.10.0
 */
exports.apS = 
/*#__PURE__*/
Apply_1.apS(exports.ApplyPar);
// -------------------------------------------------------------------------------------
// sequence T
// -------------------------------------------------------------------------------------
/**
 * @since 2.11.0
 */
exports.ApT = 
/*#__PURE__*/
exports.of(_.emptyReadonlyArray);
// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativePar)`.
 *
 * @since 2.11.0
 */
var traverseReadonlyNonEmptyArrayWithIndex = function (f) {
    return function_1.flow(T.traverseReadonlyNonEmptyArrayWithIndex(f), T.map(O.traverseReadonlyNonEmptyArrayWithIndex(function_1.SK)));
};
exports.traverseReadonlyNonEmptyArrayWithIndex = traverseReadonlyNonEmptyArrayWithIndex;
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativePar)`.
 *
 * @since 2.11.0
 */
var traverseReadonlyArrayWithIndex = function (f) {
    var g = exports.traverseReadonlyNonEmptyArrayWithIndex(f);
    return function (as) { return (_.isNonEmpty(as) ? g(as) : exports.ApT); };
};
exports.traverseReadonlyArrayWithIndex = traverseReadonlyArrayWithIndex;
/**
 * Equivalent to `ReadonlyNonEmptyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @since 2.11.0
 */
var traverseReadonlyNonEmptyArrayWithIndexSeq = function (f) { return function (as) { return function () {
    return _.tail(as).reduce(function (acc, a, i) {
        return acc.then(function (obs) {
            return _.isNone(obs)
                ? acc
                : f(i + 1, a)().then(function (ob) {
                    if (_.isNone(ob)) {
                        return ob;
                    }
                    obs.value.push(ob.value);
                    return obs;
                });
        });
    }, f(0, _.head(as))().then(O.map(_.singleton)));
}; }; };
exports.traverseReadonlyNonEmptyArrayWithIndexSeq = traverseReadonlyNonEmptyArrayWithIndexSeq;
/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(ApplicativeSeq)`.
 *
 * @since 2.11.0
 */
var traverseReadonlyArrayWithIndexSeq = function (f) {
    var g = exports.traverseReadonlyNonEmptyArrayWithIndexSeq(f);
    return function (as) { return (_.isNonEmpty(as) ? g(as) : exports.ApT); };
};
exports.traverseReadonlyArrayWithIndexSeq = traverseReadonlyArrayWithIndexSeq;
/**
 * @since 2.10.0
 */
exports.traverseArrayWithIndex = exports.traverseReadonlyArrayWithIndex;
/**
 * @since 2.10.0
 */
var traverseArray = function (f) { return exports.traverseReadonlyArrayWithIndex(function (_, a) { return f(a); }); };
exports.traverseArray = traverseArray;
/**
 * @since 2.10.0
 */
exports.sequenceArray = 
/*#__PURE__*/
exports.traverseArray(function_1.identity);
/**
 * @since 2.10.0
 */
exports.traverseSeqArrayWithIndex = exports.traverseReadonlyArrayWithIndexSeq;
/**
 * @since 2.10.0
 */
var traverseSeqArray = function (f) { return exports.traverseReadonlyArrayWithIndexSeq(function (_, a) { return f(a); }); };
exports.traverseSeqArray = traverseSeqArray;
/**
 * @since 2.10.0
 */
exports.sequenceSeqArray = 
/*#__PURE__*/
exports.traverseSeqArray(function_1.identity);
