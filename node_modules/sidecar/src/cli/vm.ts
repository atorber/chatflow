import vm from 'vm'

/**
 * Huan(202109): adding experimental vm classes/methods
 *
 * importModuleDynamically for vm module is cached #36351
 *  https://github.com/nodejs/node/issues/36351
 */
declare module 'vm' {
  export interface SourceTextModuleOptions {
    importModuleDynamically: (
      specifier: string,
      module?: any,
    ) => any
    context?: vm.Context
  }

  export type Linker = (
    specifier: string,
    extra: Object,
    referencingModule: any,
  ) => any

  export class SourceTextModule {

    constructor (
      code: string,
      options?: SourceTextModuleOptions,
    )

    link (linker: Linker): Promise<void>
    evaluate (): Promise<void>

  }
}

const importModuleDynamically = (
  identifier: string
) => import(identifier)

async function executeWithContext<T> (
  code: string,
  contextObj: object,
): Promise<undefined | T> {
  let __ret: undefined | T

  /**
   * Huan(202109): Reflect is needed for importModuleDynamically
   */
  const context = vm.createContext({
    Reflect,
    console,
    ...contextObj,

    __ret,
  })

  const assignRetCode = `__ret = await ${code}`

  const module = new vm.SourceTextModule(assignRetCode, {
    context,
    importModuleDynamically,
  })

  await module.link(() => {})
  await module.evaluate()

  return context['__ret'] as undefined | T
}

export {
  vm,
  executeWithContext,
}
export default vm
