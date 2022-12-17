
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
                "id": "fldDJcm8sDIt0",
                "name": "id",
                "type": "SingleText",
                "property": {},
                "editable": true,
                "isPrimary": true
            },
            {
                "id": "fld39evAmfVMb",
                "name": "name",
                "type": "SingleText",
                "property": {
                    "defaultValue": ""
                },
                "editable": true
            },
            {
                "id": "fldY9rUAthDEm",
                "name": "alias",
                "type": "SingleText",
                "property": {
                    "defaultValue": ""
                },
                "editable": true
            },
            {
                "id": "fldCbZKiBXklM",
                "name": "gender",
                "type": "SingleText",
                "property": {
                    "defaultValue": ""
                },
                "editable": true
            },
            {
                "id": "fldK2fgxvTDcs",
                "name": "friend",
                "type": "Checkbox",
                "property": {
                    "icon": "✅"
                },
                "editable": true
            },
            {
                "id": "fld96axLmYqKU",
                "name": "type",
                "type": "SingleText",
                "property": {
                    "defaultValue": ""
                },
                "editable": true
            },
            {
                "id": "fldfwvJnJIS4i",
                "name": "avatar",
                "type": "Text",
                "editable": true
            },
            {
                "id": "fldZveatV4H1Z",
                "name": "phone",
                "type": "SingleText",
                "property": {
                    "defaultValue": ""
                },
                "editable": true
            },
            {
                "id": "fldpm0jUT1Ch6",
                "name": "file",
                "type": "Attachment",
                "editable": true
            },
            {
                "id": "fld0reGOMyTGV",
                "name": "通知提醒",
                "type": "MagicLink",
                "property": {
                    "foreignDatasheetId": "dst6ocBSnPBUf7okNl",
                    "brotherFieldId": "fldfqyrfkWBBy"
                },
                "editable": true
            },
            {
                "id": "fldsnqqpYglrI",
                "name": "好友分组",
                "type": "MagicLink",
                "property": {
                    "foreignDatasheetId": "dsttzJxMEqxZ0m5UHZ",
                    "brotherFieldId": "fld77XnB5JGWf"
                },
                "editable": true
            },
            {
                "id": "fldByiWFJNvtP",
                "name": "通知提醒 2",
                "type": "MagicLink",
                "property": {
                    "foreignDatasheetId": "dst6ocBSnPBUf7okNl",
                    "brotherFieldId": "fldm7Ay6hZvq1"
                },
                "editable": true
            }
        ]
    },
    "message": "SUCCESS"
}

const defaultRecords: any[] = []

const fields: Field[] = vikaRes.data.fields

const contactSheet: Sheet = {
    fields,
    name: '好友列表',
    defaultRecords
}

export {
    contactSheet
}

export default contactSheet
