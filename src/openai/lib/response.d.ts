/**
    CHAT: string,
    TOKENIZE: string,
    NER: string,
    SENTIMENT: string,
    SENSITIVE: string
 */
export interface ResponseCHAT {
    [x: string]: any;
    ans_node_id: number;
    ans_node_name: string;
    answer: string;
    answer_open: number;
    answer_type: string;
    article: string;
    bid_stat: {
        curr_time: string;
        err_msg: string;
        latest_time: string;
        latest_valid: true;
        up_ret: number;
    };
    confidence: number;
    create_time: string;
    dialog_status: string;
    event: string;
    from_user_name: string;
    intent_confirm_status: string;
    list_options: false;
    msg: [
        {
            ans_node_id: 6666;
            ans_node_name: string;
            article: string;
            confidence: 1;
            content: string;
            debug_info: string;
            event: string;
            list_options: false;
            msg_type: string;
            opening: string;
            resp_title: string;
            scene_status: string;
            session_id: string;
            status: string;
            take_options_only: false;
        }
    ];
    msgtype: string;
    opening: string;
    ret: number;
    scene_status: string;
    session_id: string;
    skill_name: string;
    slot_info: [];
    slots_info: [];
    status: string;
    take_options_only: boolean;
    title: string;
    to_user_name: string;
}
export interface ResponseTOKENIZE {
    words: string[];
    POSs: number[];
    words_mix: string[];
    POSs_mix: number[];
    entities: string[];
    entity_types: number[];
}
declare type NER = {
    type: string;
    span: number[];
    text: string;
    norm: string;
};
export interface ResponseNER {
    error: null;
    entities: NER[];
}
declare type SENTIMENT = '高兴' | '无情感' | '喜欢' | '悲伤' | '厌恶' | '愤怒';
export interface ResponseSENTIMENT {
    error: null;
    result: [
        [
            keyof SENTIMENT,
            number
        ]
    ];
}
declare type SENSITIVE = 'dirty_curse' | 'other' | 'dirty_politics' | 'dirty_porno';
export interface ResponseSENSITIVE {
    error: null;
    result: [
        [
            keyof SENSITIVE,
            number
        ]
    ];
}
export declare type ResponseData = ResponseCHAT | ResponseNER | ResponseSENSITIVE | ResponseSENTIMENT | ResponseTOKENIZE;
export {}
