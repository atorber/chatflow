import type { ResponseCHAT } from './response'
import { transferNLP } from './util.js'
import type { QueryData } from './query'

export function chat (query: QueryData) {
  return transferNLP('CHAT', query) as Promise<ResponseCHAT>
}
