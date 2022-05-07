import childProcess from 'child_process'
import stripFinalNewline from 'strip-final-newline'

const TEN_MEBIBYTE = 1024 * 1024 * 10

const exec = (command, args, stdin, cwd) => {
  return new Promise((resolve, reject) => {
    let stdout = ''
    let stderr = ''

    const spawnOptions = { maxBuffer: TEN_MEBIBYTE, cwd }

    const process = childProcess.spawn(command, args, spawnOptions)

    if (stdin) {
      process.stdin.setEncoding('utf-8')
      process.stdin.write(stdin)
      process.stdin.end()
    }

    process.stdout.setEncoding('utf-8')
    process.stdout.on('data', data => {
      stdout += data
    })

    process.stderr.on('data', data => {
      stderr += data
    })

    process.on('close', code => {
      if (code !== 0) {
        return reject(Error(stderr))
      } else {
        return resolve(stripFinalNewline(stdout))
      }
    })
  })
}

export default exec
