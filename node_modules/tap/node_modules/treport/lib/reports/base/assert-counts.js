const React = require('react')
const {Box, Text} = require('ink')
const importJSX = require('@isaacs/import-jsx')
const Color = importJSX('../../color.js')
const Reset = importJSX('../../reset.js')

module.exports = ({fail, pass, todo, skip}) => (
  <Box>
    <Box width={10}>
      <Color bold><Text>Asserts:</Text></Color>
    </Box>
    <Reset><Text>{ !fail && !pass && !todo && !skip ? '0 ' : '' }</Text></Reset>
    { fail ? (
      <Box>
        <Reset><Color red><Text>{fail} failed</Text></Color></Reset>
        <Box><Text>{', '}</Text></Box>
      </Box>
    ) : <Text></Text>}
    { pass ? (
      <Box>
        <Reset><Color green><Text>{pass} passed</Text></Color></Reset>
        <Box><Text>{', '}</Text></Box>
      </Box>
    ) : <Text></Text>}
    { todo ? (
      <Box>
        <Reset><Color magenta><Text>{todo} todo</Text></Color></Reset>
        <Box><Text>{', '}</Text></Box>
      </Box>
    ) : <Text></Text>}
    { skip ? (
      <Box>
        <Reset><Color cyan><Text>{skip} skip</Text></Color></Reset>
        <Box><Text>{', '}</Text></Box>
      </Box>
    ) : <Text></Text>}
    <Box>
      <Reset><Text>of {pass + fail + todo + skip}</Text></Reset>
    </Box>
  </Box>
)
