/* eslint-disable import/extensions */
import { ResponseNER, ResponseSENTIMENT, ResponseSENSITIVE } from './response'
import { QueryData } from './query'
declare function tokenize(query: QueryData): Promise<unknown>;
declare function ner(query: QueryData): Promise<ResponseNER>;
declare function sentiment(query: QueryData): Promise<ResponseSENTIMENT>;
declare function sensitive(query: QueryData): Promise<ResponseSENSITIVE>;
export declare const nlp: {
    tokenize: typeof tokenize;
    ner: typeof ner;
    sentiment: typeof sentiment;
    sensitive: typeof sensitive;
}
export {}
