/**
 * Data Type:
 *  https://en.wikipedia.org/wiki/Data_type
 *
 * TypeScript Decorators: Parameter Decorators
 *  https://blog.wizardsoftheweb.pro/typescript-decorators-parameter-decorators/
 *
 * TypeScript Decorators: Parameter Decorators
 *  https://blog.wotw.pro/typescript-decorators-parameter-decorators/
 */
import { log } from '../../config.js'

const PARAMETER_NAME_SYMBOL = Symbol('parameterName')

/**
 * Credit: https://blog.wotw.pro/typescript-decorators-parameter-decorators/
 */
function updateParameterName (
  target         : Object,
  propertyKey    : string,
  parameterIndex : number,
  name           : string,
) {
  // Pull the array of parameter names
  const parameterNameList = Reflect.getOwnMetadata(
    PARAMETER_NAME_SYMBOL,
    target,
    propertyKey,
  ) || []
  // Add the current parameter name
  parameterNameList[parameterIndex] = name
  // Update the parameter names
  Reflect.defineMetadata(
    PARAMETER_NAME_SYMBOL,
    parameterNameList,
    target,
    propertyKey,
  )
}

function getParameterName (
  target         : Object,
  propertyKey    : string,
  parameterIndex : number,
) {
  // Pull the array of parameter names
  const parameterNameList = Reflect.getMetadata(
    PARAMETER_NAME_SYMBOL,
    target,
    propertyKey,
  ) || []
  return parameterNameList[parameterIndex]
}

function Name (parameterName: string) {
  log.verbose('Sidecar',
    '@Name(%s)',
    parameterName,
  )

  return function nameParameterDecorator (
    target         : Object,
    propertyKey    : string,
    parameterIndex : number,
  ) {
    log.verbose('Sidecar',
      '@Name(%s) nameParameterDecorator(%s, %s, %s)',
      parameterName,

      target.constructor.name,
      propertyKey,
      parameterIndex,
    )

    updateParameterName(
      target,
      propertyKey,
      parameterIndex,
      parameterName,
    )
  }
}

export {
  getParameterName,
  Name,
  PARAMETER_NAME_SYMBOL,
}
