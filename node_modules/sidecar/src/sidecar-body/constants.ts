const INIT_SYMBOL    = Symbol('init')
const ATTACH_SYMBOL  = Symbol('attatch')
const DETACH_SYMBOL  = Symbol('detach')

const SCRIPT_DESTROYED_HANDLER_SYMBOL = Symbol('scriptDestroyedHandler')
const SCRIPT_MESSAGRE_HANDLER_SYMBOL  = Symbol('scriptMessageHandler')

const LOG_EVENT_HANDLER   = Symbol('logEventHandler')
const HOOK_EVENT_HANDLER  = Symbol('hookEventHandler')

export {
  INIT_SYMBOL,
  ATTACH_SYMBOL,
  DETACH_SYMBOL,

  SCRIPT_DESTROYED_HANDLER_SYMBOL,
  SCRIPT_MESSAGRE_HANDLER_SYMBOL,

  LOG_EVENT_HANDLER,
  HOOK_EVENT_HANDLER,
}
