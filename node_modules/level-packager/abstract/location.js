'use strict'

const path = require('path')
const os = require('os')

module.exports = path.join(os.tmpdir(), 'level-packager-' + process.pid + '-' + Date.now())
