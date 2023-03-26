/* eslint-disable import/extensions */
import type { ResponseCHAT } from './response'
import {
  transferNLP,
  transferAIBOT,
} from './util'
import type { QueryData } from './query'

function chat (query: QueryData) {
  return transferNLP('CHAT', query) as Promise<ResponseCHAT>
}

function chatAibot (query: QueryData) {
  return transferAIBOT('AIBOT', query) as Promise<ResponseCHAT>
}

export { chat, chatAibot }
