const React = require('react')
const {Box, Text} = require('ink')
const importJSX = require('@isaacs/import-jsx')
const Color = importJSX('../../color.js')
const StatusMark = importJSX('./status-mark.js')


module.exports = ({ok, name, skip, todo}) => (
  !name ? <Text></Text>
  : (<Box><StatusMark res={{ok, name, skip, todo}} /><Text>{' ' + name}</Text></Box>)
)
