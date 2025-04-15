import {
  Contact,
  log,
}             from 'wechaty'

type ContactMatcherFunction       = (contact: Contact) => boolean | Promise<boolean>
type ContactMatcherOption         = boolean | string | RegExp | ContactMatcherFunction
export type ContactMatcherOptions = ContactMatcherOption | ContactMatcherOption[]

type MatchContactFunction = (contact: Contact) => Promise<boolean>

export function contactMatcher (
  matcherOptions?: ContactMatcherOptions,
): MatchContactFunction {
  log.verbose('WechatyPluginContrib', 'contactMatcher(%s)', JSON.stringify(matcherOptions))

  if (!matcherOptions) {
    return () => Promise.resolve(false)
  }

  if (!Array.isArray(matcherOptions)) {
    matcherOptions = [ matcherOptions ]
  }

  const matcherOptionList = matcherOptions

  return async function matchContact (contact: Contact): Promise<boolean> {
    log.silly('WechatyPluginContrib', 'contactMatcher() matchContact(%s)', contact)

    let isMatch = false
    for (const option of matcherOptionList) {
      if (typeof option === 'boolean') {
        isMatch = option
      } else if (typeof option === 'string') {
        isMatch = option === contact.id
      } else if (option instanceof Function) {
        isMatch = await option(contact)
      } else if (option instanceof RegExp) {
        isMatch = option.test(contact.name())
      } else {
        throw new Error('unknown option: ' + option)
      }

      if (isMatch) {
        return true
      }
    }
    // no match
    return false
  }
}
