import fs from 'fs'
import util from 'util'

import pkgUp from 'pkg-up'

export async function resolveFile (
  path: string,
): Promise<string> {
  const stat = await util.promisify(fs.lstat)(path)

  let resolvedFile: string

  if (stat.isFile()) {
    if (path.match(/\.json$/i)) {
      resolvedFile = path
    } else {
      throw new Error(`${path} is not a JSON file!`)
    }
  } else if (stat.isDirectory()) {
    const pkgFile = await pkgUp({ cwd: path })
    if (pkgFile === null) {
      throw new Error(`${path} or above directory does not include any package.json file!`)
    }
    resolvedFile = pkgFile
  } else {
    throw new Error(`${path} is neither file nor directory!`)
  }

  return resolvedFile
}
