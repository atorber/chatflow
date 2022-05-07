import fs from 'fs/promises'
import type { URL } from 'url'

async function extractClassNameList (
  url: URL,
): Promise<string[]> {
  const content = await fs.readFile(url, 'utf-8')
  return extractClassNameListFromSource(content)
}

async function extractClassNameListFromSource (
  source: string
): Promise<string[]> {
  /**
   * Extract the @Sidecar decorated classes
   */
  const REGEXP = /@Sidecar\s*\(.*?\)\s*(?:export)?\s*class\s+([A-Za-z0-9\-_]+)\s+/sg

  return Array.from(
    source.matchAll(REGEXP)
  ).map(m => m[1]!)
}

export {
  extractClassNameListFromSource,
  extractClassNameList,
}
