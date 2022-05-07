/* eslint-disable sort-keys */
// import slash      from 'slash'
import { pathToFileURL } from 'url'

import { log }    from '../config.js'

import { getMetadataSidecar }   from '../decorators/sidecar/metadata-sidecar.js'
import { extractClassNameList } from './extract-class-names.js'
import {
  executeWithContext,
}                       from './vm.js'

const metadataHandler = async ({
  file,
  name,
}: {
  file: string,
  name?: string,
}): Promise<string> => {
  log.verbose('sidecar-dump <metadata>',
    'file<%s>, name<%s>',
    file,
    name || '',
  )

  const fileUrl = pathToFileURL(file)
  file = fileUrl.href

  /**
   * Check the class name parameter
   */
  if (!name) {
    const classNameList = await extractClassNameList(fileUrl)
    if (classNameList.length === 0) {
      throw new Error(`There's no @Sidecar decorated class name found in file ${file}`)
    } else if (classNameList.length > 1) {
      console.error(`Found multiple @Sidecar decorated classes in ${file}, please specify the class name by --name:\n`)
      console.error(classNameList.map(x => '  ' + x).join('\n'))
      /**
       * return empty string when error
       */
      return ''
    }
    name = classNameList[0]
  }

  const runFuncCode = [
    '(async () => {',
    [
      `const { ${name} } = await import('${file}')`,
      `const metadata = JSON.stringify(getMetadataSidecar(${name}), null, 2)`,
      'return metadata',
    ].join('\n'),
    '})()',
  ].join('\n')

  log.silly('sidecar-dump <metadata>', runFuncCode)

  const metadata = await executeWithContext<string>(runFuncCode, {
    getMetadataSidecar,
    url: fileUrl.href,
  })

  if (!metadata) {
    throw new Error('no metadata found')
  }

  return metadata
}

export { metadataHandler }
