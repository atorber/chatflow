import { toObserver } from '../util/toobserver';
import { observable as symbolObservable } from '../observer';
class BooleanSubscription {
    isUnsubscribed = false;
    unsubscribe() {
        this.isUnsubscribed = true;
    }
}
class AsyncIterableObservable {
    _source;
    constructor(source) {
        this._source = source;
    }
    [symbolObservable]() {
        return this;
    }
    subscribe(next, error, complete) {
        const observer = toObserver(next, error, complete);
        const subscription = new BooleanSubscription();
        const it = this._source[Symbol.asyncIterator]();
        const f = () => {
            it.next()
                .then(({ value, done }) => {
                if (!subscription.isUnsubscribed) {
                    if (done) {
                        observer.complete();
                    }
                    else {
                        observer.next(value);
                        f();
                    }
                }
            })
                .catch((err) => {
                if (!subscription.isUnsubscribed) {
                    observer.error(err);
                }
            });
        };
        f();
        return subscription;
    }
}
/**
 * Converts the async-iterable sequence to an observable.
 *
 * @template TSource The type of the elements in the source sequence.
 * @param {AsyncIterable<TSource>} source The async-iterable to convert to an observable.
 * @returns {Observable<TSource>} The observable containing the elements from the async-iterable.
 */
export function toObservable(source) {
    return new AsyncIterableObservable(source);
}

//# sourceMappingURL=toobservable.mjs.map
