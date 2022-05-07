const React = require('react')
const {Text} = require('ink')
const importJSX = require('@isaacs/import-jsx')
const Base = importJSX('../base')
const Footer = importJSX('./footer.js')
const Log = importJSX('./log.js')
const Summary = importJSX('./summary.js')

class Terse extends Base {
  get Log () {
    return Log
  }
  get Footer () {
    return Footer
  }
  get Summary () {
    return Summary
  }
  get Runs () {
    return () => (<Text/>)
  }
}

module.exports = Terse
