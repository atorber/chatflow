import { run } from 'node-jq'

export interface JqOptions {
  raw?: boolean,
}

export async function jqFile (
  filter   : string,
  file     : string,
  options? : JqOptions,
): Promise<string> {
  let result = await run(filter, file, options) as string // FIXME

  // FIXME: wait for https://github.com/sanack/node-jq/pull/173 to be published
  if (options && options.raw) {
    if (result[0] === '"') {
      result = result.substr(1, result.length - 2)
    }
  }

  return result
}

export async function jqString (
  filter: string,
  text: string,
): Promise<string> {
  const result = await run(filter, text, { input: 'string' })
  return result as string // FIXME
}

export async function jqJson (
  filter : string,
  json   : object,
): Promise<string> {
  const result = await run(filter, json, { input: 'json' })
  return result as string // FIXME
}
