/**
 * https://stackoverflow.com/q/64089216/1123955
 */
// Huan(202108): FIXME: This is a temporary workaround for the above issue.
// const timer: NodeJS.Timeout = setTimeout(
const timer = setTimeout(
  () => { console.info('timeout') },
  100,
)
clearTimeout(timer)
