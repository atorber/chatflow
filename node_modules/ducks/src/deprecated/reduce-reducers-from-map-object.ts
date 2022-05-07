/**
 *   Ducks - https://github.com/huan/ducks
 *
 *   @copyright 2020 Huan LI (李卓桓) <https://github.com/huan>
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
import type {
  ActionFromReducersMapObject,
  Reducer,
  ReducersMapObject,
  StateFromReducersMapObject,
}                               from 'redux'

import reduceReducersFromArray from 'reduce-reducers'

// https://stackoverflow.com/a/50375286/1123955
type UnionToIntersection<U> =
  (U extends any ? (k: U)=>void : never) extends ((k: infer I)=>void) ? I : never

type FlatStateFromReducersMapObject <T> =
  UnionToIntersection<
    StateFromReducersMapObject<T>[
      keyof StateFromReducersMapObject<T>
    ]
  >

/**
 * Huan(202005): this function is very puzzle.
 *
 * @deprecated: we should keep the core ducks logic simple.
 *  this logic will be left to the end user to deal with,
 *  instead of providing a library helper function.
 */
function reduceReducersFromMapObject <T extends ReducersMapObject> (
  reducers: T,
): Reducer<
  FlatStateFromReducersMapObject<T>,
  ActionFromReducersMapObject<T>
> {
  return reduceReducersFromArray(
    ...Object.values(reducers)
  )
}

export {
  reduceReducersFromMapObject,
}
