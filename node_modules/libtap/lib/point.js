'use strict'
const diags = require('./diags.js')
const esc = require('./esc.js')

class TestPoint {
  constructor (ok, message, extra) {
    if (typeof ok !== 'boolean')
      throw new TypeError('ok must be boolean')

    if (typeof message !== 'string')
      throw new TypeError('message must be a string')

    extra = extra || {}
    message = message.trim().replace(/[\n\r]/g, ' ').replace(/\t/g, '  ')
    this.res = { ok, message, extra }
    this.extra = extra
    this.ok = ok ? 'ok ' : 'not ok '
    this.name = message
    this.message = tpMessage(esc(this.name), extra)
  }
}

const tpMessage = (description, extra) => {
  let message = description ? ` - ${description}` : ''

  if (extra.skip) {
    message += ' # SKIP'
    if (typeof extra.skip === 'string')
      message += ' ' + esc(extra.skip)
  } else if (extra.todo) {
    message += ' # TODO'
    if (typeof extra.todo === 'string')
      message += ' ' + esc(extra.todo)
  } else if (extra.time)
    message += ' # time=' + extra.time + 'ms'

  const diagYaml = extra.diagnostic ? diags(extra) : ''
  message += diagYaml + '\n'

  return message
}

module.exports = TestPoint
