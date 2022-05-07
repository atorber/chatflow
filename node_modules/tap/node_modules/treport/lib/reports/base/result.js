const React = require('react')
const {Box, Text} = require('ink')
const importJSX = require('@isaacs/import-jsx')
const TestPoint = importJSX('./test-point.js')
const Test = importJSX('./test.js')

module.exports = ({res, test, raw}) =>
  res ? (<TestPoint res={res} />)
  : test ? (<Test test={test} />)
  : (<Box><Text>{raw}</Text></Box>)
