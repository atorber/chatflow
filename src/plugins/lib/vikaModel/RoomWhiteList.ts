
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
                "id": "fldgii4niM8aw",
                "name": "群ID",
                "type": "SingleText",
                "property": {
                    "defaultValue": ""
                },
                "editable": true,
                "isPrimary": true
            },
            {
                "id": "flddQopavELXi",
                "name": "群名称",
                "type": "SingleText",
                "property": {},
                "editable": true
            },
            {
                "id": "fldQlUE6uw9HV",
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

const roomWhiteListSheet: Sheet = {
    fields,
    name: '群白名单',
    defaultRecords
}

export {
    roomWhiteListSheet
}

export default roomWhiteListSheet
