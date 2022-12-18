
import type {
    Sheet,
    Field
} from './Model'

const vikaRes ={
    "code": 200,
    "success": true,
    "data": {
        "fields": [
            {
                "id": "fldoYSvRnvc1f",
                "name": "内容",
                "type": "Text",
                "editable": true,
                "isPrimary": true
            },
            {
                "id": "fldfqyrfkWBBy",
                "name": "接收好友",
                "type": "MagicLink",
                "property": {
                    "foreignDatasheetId": "dstbutP3T8WorWLlbq",
                    "brotherFieldId": "fld0reGOMyTGV"
                },
                "editable": true,
                "desc": "好友列表"
            },
            {
                "id": "fldXq00SDGvS9",
                "name": "接收分组",
                "type": "MagicLink",
                "property": {
                    "foreignDatasheetId": "dsttzJxMEqxZ0m5UHZ",
                    "brotherFieldId": "fldNqvOAzEkxC"
                },
                "editable": true,
                "desc": "好友分组"
            },
            {
                "id": "fldJ1TvTV1T8c",
                "name": "接收群",
                "type": "MagicLink",
                "property": {
                    "foreignDatasheetId": "dstRVUymHGd1e4mrWU",
                    "brotherFieldId": "flduYxMKg3ERW"
                },
                "editable": true,
                "desc": "群列表"
            },
            {
                "id": "fldm7Ay6hZvq1",
                "name": "@群成员",
                "type": "MagicLink",
                "property": {
                    "foreignDatasheetId": "dstbutP3T8WorWLlbq",
                    "brotherFieldId": "fldByiWFJNvtP"
                },
                "editable": true,
                "desc": "好友列表"
            },
            {
                "id": "fldoCm0thVXmq",
                "name": "时间",
                "type": "DateTime",
                "property": {
                    "format": "YYYY/MM/DD HH:mm",
                    "includeTime": true
                },
                "editable": true
            },
            {
                "id": "fldTnEtGqFIt6",
                "name": "周期",
                "type": "SingleSelect",
                "property": {
                    "options": [
                        {
                            "id": "optrcyujqFycE",
                            "name": "无重复",
                            "color": {
                                "name": "deepPurple_0",
                                "value": "#E5E1FC"
                            }
                        },
                        {
                            "id": "optpUa6oOH7mb",
                            "name": "每天",
                            "color": {
                                "name": "indigo_0",
                                "value": "#DDE7FF"
                            }
                        },
                        {
                            "id": "opt1PXrPyuWwu",
                            "name": "每周",
                            "color": {
                                "name": "blue_0",
                                "value": "#DDF5FF"
                            }
                        },
                        {
                            "id": "optiiAF9BNYKj",
                            "name": "每月",
                            "color": {
                                "name": "yellow_0",
                                "value": "#FFF6D8"
                            }
                        },
                        {
                            "id": "optnWPpccOnnb",
                            "name": "每小时",
                            "color": {
                                "name": "teal_0",
                                "value": "#D6F3E8"
                            }
                        },
                        {
                            "id": "optrcSxCfZzyR",
                            "name": "每分钟",
                            "color": {
                                "name": "green_0",
                                "value": "#DCF3D1"
                            }
                        }
                    ]
                },
                "editable": true
            }
        ]
    },
    "message": "SUCCESS"
}

const defaultRecords: any[] = []

const fields: Field[] = vikaRes.data.fields

const noticeSheet: Sheet = {
    fields,
    name: '通知提醒',
    defaultRecords
}

export {
    noticeSheet
}

export default noticeSheet
