/* eslint-disable sort-keys */
import { pathToFileURL } from 'url'

import { log }  from '../config.js'

import { getMetadataSidecar }   from '../decorators/sidecar/metadata-sidecar.js'
import { buildAgentSource }     from '../agent/build-agent-source.js'

import { extractClassNameList } from './extract-class-names.js'
import { executeWithContext }   from './vm.js'

const sourceHandler = async ({
  file,
  name,
}: {
  file: string,
  name?: string,
}): Promise<string> => {
  log.verbose('sidecar-dump <source>',
    'file<%s>%s',
    file,
    name
      ? `, name<${name}>`
      : '',
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
    log.silly('sidecar-dump <source>',
      'detected class name: "%s"',
      name,
    )
  }

  const runFuncCode = [
    '(async () => {',
    [
      `const { ${name} } = await import('${file}')`,
      `const metadata = getMetadataSidecar(${name})`,
      'const agentSource = await buildAgentSource(metadata)',
      'return agentSource',
    ].join('\n'),
    '})()',
  ].join('\n')

  log.silly('sidecar-dump <source>', runFuncCode)

  const agentSource = await executeWithContext<string>(runFuncCode, {
    buildAgentSource,
    getMetadataSidecar,
    url: fileUrl.href,
  })

  if (!agentSource) {
    throw new Error('no agentSource found')
  }

  return agentSource
}

export { sourceHandler }
