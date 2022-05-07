const React = require('react')
const importJSX = require('@isaacs/import-jsx')
const {Static} = require('ink')
const Result = importJSX('./result.js')

module.exports = ({log}) => (<Static items={log}>{
  (result, i) => (<Result {...result} key={`${i}`} /> )
}</Static>)
