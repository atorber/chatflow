export const acitonFields = {
  code: 200,
  success: true,
  data: {
    fields: [
      {
        id: 'fldljzplNFLxH',
        name: '分类(必填)|skillname',
        type: 'Text',
        editable: true,
        isPrimary: true,
      },
      {
        id: 'fldPVePxESZ1E',
        name: '标准问题(必填)|title',
        type: 'Text',
        editable: true,
      },
      {
        id: 'fldUEXdAhTzlt',
        name: '相似问题1(选填)|question1',
        type: 'Text',
        editable: true,
      },
      {
        id: 'fld0FMab66JzE',
        name: '相似问题2(选填)|question2',
        type: 'Text',
        editable: true,
      },
      {
        id: 'fldKXmqxlXuCz',
        name: '相似问题3(选填)|question3',
        type: 'Text',
        editable: true,
      },
      {
        id: 'fldnu4M9NyIIx',
        name: '机器人回答(必填)|answer',
        type: 'Text',
        editable: true,
      },
      {
        id: 'fldOEh1RPNtx3',
        name: '启用状态|state',
        type: 'SingleSelect',
        property: {
          options: [
            {
              id: 'opteWxGg5mvPP',
              name: '启用',
              color: { name: 'deepPurple_0', value: '#E5E1FC' },
            },
            {
              id: 'optX67msptucG',
              name: '停用',
              color: { name: 'indigo_0', value: '#DDE7FF' },
            },
          ],
        },
        editable: true,
      },
      {
        id: 'fld23GGnV4tNP',
        name: '同步状态|syncStatus',
        type: 'SingleSelect',
        property: {
          options: [
            {
              id: 'optgBphdOFkA5',
              name: '未同步',
              color: { name: 'indigo_0', value: '#DDE7FF' },
            },
            {
              id: 'opthCgGQILUWj',
              name: '已同步',
              color: { name: 'deepPurple_0', value: '#E5E1FC' },
            },
            {
              id: 'optG3MKM3MMkk',
              name: '同步失败',
              color: { name: 'blue_0', value: '#DDF5FF' },
            },
          ],
        },
        editable: true,
      },
      {
        id: 'fld1LaNksJLDa',
        name: '最后操作时间|lastOperationTime',
        type: 'DateTime',
        property: {
          format: 'YYYY-MM-DD HH:mm',
          includeTime: true,
          autoFill: true,
        },
        editable: true,
      },
      {
        id: 'fld2XBme6uAoF',
        name: '操作|action',
        type: 'SingleSelect',
        property: {
          options: [
            {
              id: 'optt4uJVT8R9A',
              name: '选择操作',
              color: { name: 'green_0', value: '#DCF3D1' },
            },
            {
              id: 'optLwTD20mANS',
              name: '提交此条',
              color: { name: 'deepPurple_0', value: '#E5E1FC' },
            },
            {
              id: 'optwEgi4xDTId',
              name: '提交全部',
              color: { name: 'indigo_0', value: '#DDE7FF' },
            },
            {
              id: 'optF9RPpvQ6BC',
              name: '删除此条',
              color: { name: 'blue_0', value: '#DDF5FF' },
            },
          ],
        },
        editable: true,
      },
    ],
  },
  message: 'SUCCESS',
};
