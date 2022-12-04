import { ResponseCHAT } from './response'
import { QueryData } from './query'
declare function chat(query: QueryData): Promise<ResponseCHAT>;
declare function chatAibot(query: QueryData): Promise<ResponseCHAT>;
export { chat, chatAibot }
