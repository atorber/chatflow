#!/usr/bin/env node
/**
 *
 * An example hook script to verify what is about to be committed.
 * Called by "git commit" with no arguments.  The hook should
 * exit with non-zero status after issuing an appropriate message if
 * it wants to stop the commit.
 *
 * To enable this hook, rename this file to "pre-commit".
 *
 */
const shell = require('shelljs')

const NO_HOOK_VAR = 'NO_HOOK'
const INNER_PRE_HOOK = 'CHATIE_INNER_PRE_HOOK'

if (process.env[NO_HOOK_VAR]) {
  // user set NO_HOOK=1 to prevent this hook works
  process.exit(0)
}

if (process.env[INNER_PRE_HOOK]) {
  // http://stackoverflow.com/a/21334985/1123955
  process.exit(0)
}

shell.rm('-f', 'package-lock.json')
shell.exec('npm version patch --no-package-lock').code === 0 || process.exit(1)
process.env[INNER_PRE_HOOK] = '1'
shell.exec('git push').code === 0 || process.exit(1)

console.info(String.raw`
____ _ _        ____            _
/ ___(_) |_     |  _ \ _   _ ___| |__
| |  _| | __|    | |_) | | | / __| '_ \
| |_| | | |_     |  __/| |_| \__ \ | | |
\____|_|\__|    |_|    \__,_|___/_| |_|

____                              _ _
/ ___| _   _  ___ ___ ___  ___  __| | |
\___ \| | | |/ __/ __/ _ \/ _ \/ _^ | |
___) | |_| | (_| (_|  __/  __/ (_| |_|
|____/ \__,_|\___\___\___|\___|\__,_(_)

`)

console.info(`



 ### Npm verion bumped and pushed by inner push inside hook pre-push ###"
 ------- vvvvvvv outer push will be canceled, never mind vvvvvvv -------"


`)

process.exit(1)
