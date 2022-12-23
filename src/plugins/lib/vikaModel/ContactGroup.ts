
import type {
    Sheet,
    Field
} from './Model'

const vikaRes = {
    "code": 200,
    "success": true,
    "data": {
        "fields": [
            {
                "id": "fldgPYseCnwqz",
                "name": "分组名称",
                "type": "SingleText",
                "property": {
                    "defaultValue": ""
                },
                "editable": true,
                "isPrimary": true
            },
            {
                "id": "fld77XnB5JGWf",
                "name": "联系人",
                "type": "MagicLink",
                "property": {
                    "foreignDatasheetId": "dstbutP3T8WorWLlbq",
                    "brotherFieldId": "fldsnqqpYglrI"
                },
                "editable": true,
                "desc": "好友列表"
            },
            {
                "id": "fldTE6BPvtD7h",
                "name": "备注",
                "type": "Text",
                "editable": true
            }
        ]
    },
    "message": "SUCCESS"
}

const defaultRecords: any[] = []

const fields: Field[] = vikaRes.data.fields

const groupSheet: Sheet = {
    fields,
    name: '好友分组',
    defaultRecords
}

export {
    groupSheet
}

export default groupSheet
