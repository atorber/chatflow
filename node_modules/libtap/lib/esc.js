// turn \ into \\ and # into \#, for stringifying back to TAP
module.exports = str => str.replace(/\\/g, '\\\\').replace(/#/g, '\\#')
