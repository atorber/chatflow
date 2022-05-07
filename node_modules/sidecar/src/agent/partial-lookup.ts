/**
 * partial.mustache -> templates/
 */
import fs from 'fs'
import path from 'path'

import { codeRoot } from '../cjs.js'

function partialLookup (partial: string) {
  const file = path.join(
    codeRoot,
    'src',
    'agent',
    'templates',
    partial,
  )
  if (!file) {
    throw new Error(`partial name "${partial}" not found from path "${file}"`)
  }

  return fs.readFileSync(file).toString()
}

export { partialLookup }
