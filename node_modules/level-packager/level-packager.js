'use strict'

const levelup = require('levelup')
const encode = require('encoding-down')

function packager (leveldown) {
  function Level (location, options, callback) {
    if (typeof location === 'function') {
      callback = location
    } else if (typeof options === 'function') {
      callback = options
    }

    if (!isObject(options)) {
      options = isObject(location) ? location : {}
    }

    return levelup(encode(leveldown(location, options), options), options, callback)
  }

  function isObject (o) {
    return typeof o === 'object' && o !== null
  }

  for (const m of ['destroy', 'repair']) {
    if (typeof leveldown[m] === 'function') {
      Level[m] = function (...args) {
        leveldown[m](...args)
      }
    }
  }

  Level.errors = levelup.errors

  return Level
}

module.exports = packager
