import { ApiTypes } from './API';
import { QueryData } from './query';
declare function checkInit(): string;
declare function genToken(query: QueryData): any;
declare function transferAIBOT<T extends keyof ApiTypes>(nlpType: T, query: QueryData): Promise<unknown>;
declare function transferNLP<T extends keyof ApiTypes>(nlpType: T, query: QueryData): Promise<unknown>;
export { checkInit, genToken, transferNLP, transferAIBOT, };
