import exec from './exec'
import { commandFactory } from './command'

export const run = (filter, json, options = {}, jqPath, cwd) => {
  return new Promise((resolve, reject) => {
    const { command, args, stdin } = commandFactory(
      filter,
      json,
      options,
      jqPath
    )

    exec(command, args, stdin, cwd)
      .then((stdout) => {
        if (options.output === 'json') {
          let result
          try {
            result = JSON.parse(stdout)
          } catch (error) {
            result = stdout
          }
          return resolve(result)
        } else {
          return resolve(stdout)
        }
      })
      .catch(reject)
  })
}
