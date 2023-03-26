/* eslint-disable sort-keys */
/* eslint-disable import/extensions */
import type { ResponseNER, ResponseSENTIMENT, ResponseSENSITIVE } from './response'
import { transferNLP } from './util'
import type { QueryData } from './query'

function tokenize (query: QueryData) {
  return transferNLP('TOKENIZE', query)
}

function ner (query: QueryData) {
  return transferNLP('NER', query) as Promise<ResponseNER>
}

function sentiment (query: QueryData) {
  return transferNLP('SENTIMENT', query) as Promise<ResponseSENTIMENT>
}

function sensitive (query: QueryData) {
  return transferNLP('SENSITIVE', query) as Promise<ResponseSENSITIVE>
}

export const nlp = { tokenize, ner, sentiment, sensitive }
