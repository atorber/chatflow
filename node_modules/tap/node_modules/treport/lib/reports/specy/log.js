const React = require('react')
const importJSX = require('@isaacs/import-jsx')
const {Static, Box, Text} = require('ink')
const TestPoint = importJSX('./test-point.js')

module.exports = ({log}) => (
  <Static items={log.filter(result => !result.test)}>{
    ({res, raw}, i) =>
      res ? (<TestPoint res={res} key={`${i}`}/>)
      : (<Box key={`${i}`}><Text>{raw}</Text></Box>)
  }</Static>
)
