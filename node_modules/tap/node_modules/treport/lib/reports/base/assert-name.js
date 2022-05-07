const React = require('react')
const {Box, Text} = require('ink')
const importJSX = require('@isaacs/import-jsx')
const Color = importJSX('../../color.js')

const glyphColor = ({ ok, skip, todo }) => ({
  [ skip ? 'cyan'
  : todo ? 'magenta'
  : !ok ? 'red'
  : 'green']: true,
})

const glyphText = ({ ok, skip, todo }) =>
  skip ? ' ~ '
  : todo ? ' ☐ '
  : !ok ? ' ✖ '
  : ' ✓ '

const Glyph = ({ ok, skip, todo }) => (
  <Box width={3}>
    <Color bold {...glyphColor({ok, skip, todo})}>
      <Text>{glyphText({ok, skip, todo})}</Text>
    </Color>
  </Box>
)

const Reason = ({skip, todo}) =>
  skip && skip !== true ? (
    <Box>
      <Text>{' > '}</Text>
      <Color {...glyphColor({skip, todo})}><Text>{skip}</Text></Color>
    </Box>
  )
  : todo && todo !== true ? (
    <Box>
      <Text>{' > '}</Text>
      <Color {...glyphColor({skip, todo})}><Text>{todo}</Text></Color>
    </Box>
  )
  : <Text></Text>

const AssertName = ({ ok, name, skip, todo }) => (
  <Box>
    <Glyph {...{ok, skip, todo}} />
    <Text>{name || '(unnamed test)'}</Text>
    <Reason {...{skip, todo}} />
  </Box>
)

module.exports = AssertName
