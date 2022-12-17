
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
                "id": "fldVWq6zteuyr",
                "name": "好友ID",
                "type": "SingleText",
                "property": {
                    "defaultValue": ""
                },
                "editable": true,
                "isPrimary": true
            },
            {
                "id": "fldh6BOfEyKn0",
                "name": "昵称",
                "type": "SingleText",
                "property": {},
                "editable": true
            },
            {
                "id": "fldFv7pl3973t",
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

const contactWhiteListSheet: Sheet = {
    fields,
    name: '好友白名单',
    defaultRecords
}

export {
    contactWhiteListSheet
}

export default contactWhiteListSheet
