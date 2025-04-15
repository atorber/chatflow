import {
  Contact,
  log,
  Room,
}               from 'wechaty'
import Mustache from  'mustache'

import type * as types from '../types/mod.js'

type ContactTalkerFunction        = (contact: Contact, room?: Room) => types.TalkerMessage | Promise<types.TalkerMessage>
type ContactTalkerOption          = types.TalkerMessage | ContactTalkerFunction
export type ContactTalkerOptions  = ContactTalkerOption | ContactTalkerOption[]

export function contactTalker<T = void> (options?: ContactTalkerOptions) {
  log.verbose('WechatyPluginContrib', 'contactTalker(%s)', JSON.stringify(options))

  if (!options) {
    return () => undefined
  }

  if (!Array.isArray(options)) {
    options = [ options ]
  }

  const optionList = options

  return async function talkContact (contact: Contact, room?: Room, mustacheView?: T): Promise<void> {
    log.silly('WechatyPluginContrib', 'contactTalker() talkContact(%s, %s)',
      contact,
      mustacheView
        ? JSON.stringify(mustacheView)
        : '',
    )

    for (const option of optionList) {
      let msg
      if (option instanceof Function) {
        msg = await option(contact, room)
      } else {
        msg = option
      }

      if (!msg) { continue }

      if (typeof msg === 'string') {
        if (mustacheView) {
          msg = Mustache.render(msg, mustacheView)
        }

        await contact.say(msg)

      } else {
        /**
         *  FIXME(huan): https://github.com/microsoft/TypeScript/issues/14107
         */
        await contact.say(msg as any)
      }

      await contact.wechaty.sleep(1000)
    }
  }
}
