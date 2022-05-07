// component that resets the color
const React = require('react')
const {Text} = require('ink')
const importJSX = require('@isaacs/import-jsx')
const Color = importJSX('./color.js')
module.exports = ({children}) => <><Color reset><Text>{'\u200b'}</Text></Color>{children}<Color reset><Text>{'\u200b'}</Text></Color></>
