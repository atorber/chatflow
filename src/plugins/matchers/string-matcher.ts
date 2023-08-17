import {
  log,
}           from 'wechaty'

type StringMatcherFunction        = (str: string) => boolean | Promise<boolean>
type StringMatcherOption          = boolean | string | RegExp | StringMatcherFunction
export type StringMatcherOptions  = StringMatcherOption | StringMatcherOption[]

type MatchStringFunction = (text: string) => Promise<boolean>

export function stringMatcher (
  options?: StringMatcherOptions,
): MatchStringFunction {
  log.verbose('WechatyPluginContrib', 'stringMatcher(%s)', JSON.stringify(options))

  if (!options) {
    return () => Promise.resolve(false)
  }

  if (!Array.isArray(options)) {
    options = [ options ]
  }

  const optionsList = options

  return async function matchString (str: string): Promise<boolean> {
    log.verbose('WechatyPluginContrib', 'stringMatcher() matchString(%s)', str)

    let isMatch = false
    for (const option of optionsList) {
      if (typeof option === 'boolean') {
        isMatch = option
      } if (typeof option === 'string') {
        isMatch = (str === option)
      } else if (option instanceof RegExp) {
        isMatch = option.test(str)
      } else if (option instanceof Function) {
        isMatch = await option(str)
      } else {
        throw new Error('configPassword is unknown: ' + option)
      }

      if (isMatch) {
        return true
      }

    }
    // no match
    return false
  }
}
