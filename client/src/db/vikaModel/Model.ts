enum FieldType {
    SingleText = 'SingleText',
    SingleSelect = 'SingleSelect',
    Text = 'Text',
    Attachment = 'Attachment'
}

type Field = {
    id?:string,
    name: string,
    type: string,
    property?: any,
    desc?: string,
    editable?: boolean,
    isPrimary?: boolean,
};

type FieldSingleText = Field & { type: FieldType.SingleText };
type FieldSingleSelect = Field & { type: FieldType.SingleSelect };
type FieldText = Field & { type: FieldType.Text };

type Record = {
    fields: {
        [key: string]: string | number | boolean
    }
}

type Sheet = {
    fields: Field[],
    name: string,
    defaultRecords: Record[]
}

type Sheets = {
    [key: string]: Sheet
}

export {
  FieldType,
  type Field,
  type FieldSingleText,
  type FieldSingleSelect,
  type FieldText,
  type Record,
  type Sheet,
  type Sheets,
}
