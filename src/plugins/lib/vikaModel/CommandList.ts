
import type {
    Sheet,
    Field
} from './Model'

const recordRes = {
    "code": 200,
    "success": true,
    "data": {
        "total": 6,
        "records": [
            {
                "recordId": "recUqpQPkMrQO",
                "createdAt": 1670218148000,
                "updatedAt": 1670218148000,
                "fields": {
                    "指令名称": "更新配置",
                    "类型": "系统指令",
                    "说明": "更新系统配置，更改配置后需主动更新一次配置配置才会生效"
                }
            },
            {
                "recordId": "reck2x7TobP0D",
                "createdAt": 1670218148000,
                "updatedAt": 1670218148000,
                "fields": {
                    "指令名称": "更新白名单",
                    "类型": "系统指令",
                    "说明": "更新群白名单，白名单变动时需主动更新白名单"
                }
            },
            {
                "recordId": "recuczAHqUTOv",
                "createdAt": 1670218148000,
                "updatedAt": 1670218148000,
                "fields": {
                    "指令名称": "更新问答",
                    "类型": "系统指令",
                    "说明": "更新微信对话平台中的问答列表"
                }
            },
            {
                "recordId": "recZi3MqRfoLP",
                "createdAt": 1670218148000,
                "updatedAt": 1670218148000,
                "fields": {
                    "指令名称": "更新机器人",
                    "类型": "系统指令",
                    "说明": "更新机器人的群列表和好友列表"
                }
            },
            {
                "recordId": "recRr9P8QmRyA",
                "createdAt": 1670218148000,
                "updatedAt": 1670218148000,
                "fields": {
                    "指令名称": "启用问答",
                    "类型": "群指令",
                    "说明": "当前群启用智能问答"
                }
            },
            {
                "recordId": "rec0Ya8vDiV86",
                "createdAt": 1670218148000,
                "updatedAt": 1670218148000,
                "fields": {
                    "指令名称": "关闭问答",
                    "类型": "群指令",
                    "说明": "当前群关闭智能问答"
                }
            }
        ],
        "pageNum": 1,
        "pageSize": 6
    },
    "message": "SUCCESS"
}

const defaultRecords: any[] = recordRes.data.records

const vikaRes = {
    "code": 200,
    "success": true,
    "data": {
        "fields": [
            {
                "id": "fldCSCcQI7iEm",
                "name": "指令名称",
                "type": "SingleText",
                "property": {
                    "defaultValue": ""
                },
                "editable": true,
                "isPrimary": true
            },
            {
                "id": "fldplyGKKgxME",
                "name": "说明",
                "type": "Text",
                "editable": true
            },
            {
                "id": "fldE1R4eb6E8S",
                "name": "管理员微信号",
                "type": "SingleText",
                "property": {},
                "editable": true
            },
            {
                "id": "fldopkUTne42Y",
                "name": "类型",
                "type": "SingleSelect",
                "property": {
                    "options": [
                        {
                            "id": "optYAC1AnMzGf",
                            "name": "系统指令",
                            "color": {
                                "name": "deepPurple_0",
                                "value": "#E5E1FC"
                            }
                        },
                        {
                            "id": "opt7qitH0LOpj",
                            "name": "群指令",
                            "color": {
                                "name": "indigo_0",
                                "value": "#DDE7FF"
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

const fields: Field[] = vikaRes.data.fields

const commandSheet: Sheet = {
    fields,
    name: '指令列表',
    defaultRecords
}

export {
    commandSheet
}

export default commandSheet
