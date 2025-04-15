import {
  Message,
  log,
}           from 'wechaty'

type MessageMatcherFunction       = (msg: Message) => boolean | Promise<boolean>
type MessageMatcherOption         = boolean | string | RegExp | MessageMatcherFunction
export type MessageMatcherOptions = MessageMatcherOption | MessageMatcherOption[]

type MatchMessageFunction = (message: Message) => Promise<boolean>

function messageMatcher (
  matcherOptions?: MessageMatcherOptions,
): MatchMessageFunction {
  log.verbose('WechatyPluginContrib', 'messageMatcher(%s)', JSON.stringify(matcherOptions))

  if (!matcherOptions) {
    return () => Promise.resolve(false)
  }

  if (!Array.isArray(matcherOptions)) {
    matcherOptions = [ matcherOptions ]
  }

  const matcherOptionList = matcherOptions

  return async function matchMessage (message: Message): Promise<boolean> {
    log.verbose('WechatyPluginContrib', 'messageMatcher() matchMessage(%s)', message)

    let isMatch = false
    for (const option of matcherOptionList) {
      if (typeof option === 'boolean') {
        isMatch = option
      } else if (typeof option === 'string') {
        const idCheckList = [
          message.talker().id,
          message.room()?.id,
        ]
        isMatch = idCheckList.includes(option)
      } else if (option instanceof RegExp) {
        const text = await message.mentionText()
        const textCheckList = [
          text,
          message.talker().name(),
          await message.room()?.topic(),
        ]
        isMatch = textCheckList.some(text => text && option.test(text))
      } else if (typeof option === 'function') {
        isMatch = await option(message)
      } else {
        throw new Error('unknown matcher ' + option)
      }

      if (isMatch) {
        return true
      }

    }
    // no match
    return false
  }
}

export {
  messageMatcher,
}
