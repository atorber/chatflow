import {
  Observable,
  firstValueFrom,
  from,
}                 from 'rxjs'
import {
  filter,
  // eslint-disable-next-line import/extensions
}                 from 'rxjs/operators'
import type {
  State,
  Interpreter,
  StateSchema,
}                 from 'xstate'

const waitForSelector = async <T> (
  stream$: Observable<T>,
  selector: (x: T) => boolean,
): Promise<void> => {
  const future = firstValueFrom(
    stream$.pipe(
      filter(selector),
    ),
  )
  return future.then(() => undefined)
}

const waitForMachineState = async <TServiceCtlState extends StateSchema> (
  interpreter: Interpreter<
    any,
    TServiceCtlState,
    any
>,
  state: keyof TServiceCtlState['states'],
): Promise<void> => {
  const selector = (
    x: State<any, any, TServiceCtlState>,
  ) => x.value === state

  return waitForSelector(
    from(interpreter),
    selector,
  )
}

export {
  waitForSelector,
  waitForMachineState,
}
