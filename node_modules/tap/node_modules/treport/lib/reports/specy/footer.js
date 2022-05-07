const React = require('react')
const {Box} = require('ink')
const importJSX = require('@isaacs/import-jsx')
const AssertCounts = importJSX('../base/assert-counts.js')
const SuiteCounts = importJSX('../base/suite-counts.js')

module.exports = ({suiteCounts, assertCounts, time}) => (
  <Box flexDirection="column">
    <SuiteCounts {...suiteCounts} />
    <AssertCounts {...assertCounts} />
  </Box>
)
