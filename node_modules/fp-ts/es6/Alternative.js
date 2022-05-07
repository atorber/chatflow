/**
 * The `Alternative` type class extends the `Alt` type class with a value that should be the left and right identity for `alt`.
 *
 * It is similar to `Monoid`, except that it applies to types of kind `* -> *`, like `Array` or `Option`, rather than
 * concrete types like `string` or `number`.
 *
 * `Alternative` instances should satisfy the following laws:
 *
 * 1. Left identity: `A.alt(zero, fa) <-> fa`
 * 2. Right identity: `A.alt(fa, zero) <-> fa`
 * 3. Annihilation: `A.map(zero, f) <-> zero`
 * 4. Distributivity: `A.ap(A.alt(fab, gab), fa) <-> A.alt(A.ap(fab, fa), A.ap(gab, fa))`
 * 5. Annihilation: `A.ap(zero, fa) <-> zero`
 *
 * @since 2.0.0
 */
import { altAll as altAll_ } from './Alt';
export function altAll(F) {
    return altAll_(F)(F.zero());
}
