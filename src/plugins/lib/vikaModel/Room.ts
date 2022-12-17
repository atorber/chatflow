
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
                "id": "fld0DNOa8mCoC",
                "name": "id",
                "type": "SingleText",
                "property": {},
                "editable": true,
                "isPrimary": true
            },
            {
                "id": "fldr1dFmmZd0y",
                "name": "topic",
                "type": "SingleText",
                "property": {
                    "defaultValue": ""
                },
                "editable": true
            },
            {
                "id": "fld36Of6QwGZy",
                "name": "ownerId",
                "type": "SingleText",
                "property": {
                    "defaultValue": ""
                },
                "editable": true
            },
            {
                "id": "fld96Wo2Jn0tW",
                "name": "avatar",
                "type": "Text",
                "editable": true
            },
            {
                "id": "fldyW6b6RLGNC",
                "name": "adminIdList",
                "type": "Text",
                "editable": true
            },
            {
                "id": "fldLSc8IyEw7t",
                "name": "memberIdList",
                "type": "Text",
                "editable": true
            },
            {
                "id": "fldrULE0yzHXN",
                "name": "external",
                "type": "SingleText",
                "property": {
                    "defaultValue": ""
                },
                "editable": true
            },
            {
                "id": "fldZ0MvElgzQX",
                "name": "file",
                "type": "Attachment",
                "editable": true
            },
            {
                "id": "flduYxMKg3ERW",
                "name": "通知提醒",
                "type": "MagicLink",
                "property": {
                    "foreignDatasheetId": "dst6ocBSnPBUf7okNl",
                    "brotherFieldId": "fldJ1TvTV1T8c"
                },
                "editable": true
            }
        ]
    },
    "message": "SUCCESS"
}

const defaultRecords: any[] = []

const fields: Field[] = vikaRes.data.fields

const roomListSheet: Sheet = {
    fields,
    name: '群列表',
    defaultRecords
}

export {
    roomListSheet
}

export default roomListSheet
