const React = require('react')
const {Box, Text} = require('ink')
const importJSX = require('@isaacs/import-jsx')
const Color = importJSX('../../color.js')
const Reset = importJSX('../../reset.js')

const pending = () => (<Color hex='#000' bgYellow bold><Text>{' RUNS '}</Text></Color>)
const fail = () => (<Color hex='#fff' bgRed bold><Text>{' FAIL '}</Text></Color>)
const skip = () => (<Color bgBlue rgb={[255,255,255]} bold><Text>{' SKIP '}</Text></Color>)
const todo = () => (<Color bold bgRgb={[127,0,127]} rgb={[255,255,255]}><Text>{' TODO '}</Text></Color>)
const pass = () => (<Color bgGreen rgb={[0,0,0]} bold><Text>{' PASS '}</Text></Color>)

module.exports = ({test, res}) => <Reset>{
  test ? (
    !test.results ? pending()
    : !test.results.ok ? fail()
    : test.options.skip || test.counts.skip > test.counts.todo ? skip()
    : test.options.todo || test.counts.todo ? todo()
    : pass()
  ) : res ? (
    res.skip ? skip()
    : res.todo ? todo()
    : !res.ok ? fail()
    : pass()
  ) : <Text></Text>
}</Reset>
