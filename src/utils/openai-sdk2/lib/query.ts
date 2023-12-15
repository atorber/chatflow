/**
    CHAT: string,
    TOKENIZE: string,
    NER: string,
    SENTIMENT: string,
    SENSITIVE: string
 */

interface baseQueryType {
    uid: string;
    data: {
        q: string;
    }
}

interface CHATQueryData {
    username: string;
    msg: string;
}

interface TOKENIZEQueryData extends baseQueryType {

}
interface NERQueryData extends baseQueryType {

}

interface SENTIMENTQueryData extends baseQueryType {
    data: {
        q: string;
        mode: string;
    }
}

interface SENSITIVEQueryData extends baseQueryType { }

export type QueryData = CHATQueryData | TOKENIZEQueryData | NERQueryData | SENTIMENTQueryData | SENSITIVEQueryData
