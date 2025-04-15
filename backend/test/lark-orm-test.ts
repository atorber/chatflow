/* eslint-disable no-console */
import 'dotenv/config.js';
import { BiTable } from '../src/db/lark-db';
import { BaseEntity, MappingOptions, IRecord } from '../src/db/lark-orm';

async function main() {
  const db = new BiTable();
  const dbInit = await db.createSheet({
    token: process.env.VIKA_TOKEN || '',
    spaceId: process.env.VIKA_SPACE_ID || '',
  });

  console.log('dbInit:', JSON.stringify(dbInit));

  await db.createSheet;

  class Env extends BaseEntity {
    name?: string;

    key?: string;

    value?: string;

    desc?: string;

    syncStatus?: string;

    lastOperationTime?: string;

    action?: string;

    // protected static override recordId: string = ''  // 定义记录ID，初始为空字符串

    protected override mappingOptions: MappingOptions = {
      // 定义字段映射选项
      fieldMapping: {
        // 字段映射
        name: '配置项|name',
        key: '标识|key',
        value: '值|value',
        desc: '说明|desc',
        syncStatus: '同步状态|syncStatus',
        lastOperationTime: '最后操作时间|lastOperationTime',
        action: '操作|action',
      },
      tableName: '环境变量|Env', // 表名
    }; // 设置映射选项为上面定义的 mappingOptions

    protected override getMappingOptions(): MappingOptions {
      // 获取映射选项的方法
      return this.mappingOptions; // 返回当前类的映射选项
    }

    override setMappingOptions(options: MappingOptions) {
      // 设置映射选项的方法
      this.mappingOptions = options; // 更新当前类的映射选项
    }
  }

  // 测试
  const env = new Env();
  await env.setVikaOptions({
    apiKey: process.env.VIKA_TOKEN || '',
    baseId: db.dataBaseIds.envSheet, // 设置 base ID
  });

  console.log('env:', JSON.stringify(env.config, null, 2));

  const recordsAll = await env.findAll();
  console.log('查询全部记录envData:', JSON.stringify(recordsAll));

  const records: any[] = [
    {
      name: '测试sssss22222',
      key: 'MESSAGE_ENCODINGAESKEY',
      value: 'X00fcQHkvRkNUdJefu4FD6pym2oIvs63Y5NP3pnZ5po',
      syncStatus: '已同步',
      desc: '消息加密密钥，vika推送地址https://3sewxanjdvsbp.cfc-execute.bj.baidubce.com/mqtt',
      lastOperationTime: 1700326172112,
    },
    {
      name: '测试sssss11111',
      key: 'MESSAGE_ENCODINGAESKEY',
      value: 'X00fcQHkvRkNUdJefu4FD6pym2oIvs63Y5NP3pnZ5po',
      syncStatus: '已同步',
      desc: '消息加密密钥，vika推送地址https://3sewxanjdvsbp.cfc-execute.bj.baidubce.com/mqtt',
      lastOperationTime: 1700326172112,
    },
  ];
  const record = records[0] as any;
  const res1 = await env.create(record);
  console.log('创建单条记录res1:', JSON.stringify(res1, null, 2));

  const res2 = await env.createBatch(records);
  console.log('批量创建记录res2:', JSON.stringify(res2, null, 2));

  // const recordsAll2 = recordsAll.filter((item: { fields: { name: string } }) => (item.fields.name === '测试sssss11111' || item.fields.name === '测试sssss22222'))
  // console.log('筛选记录recordsAll2:', JSON.stringify(recordsAll2, null, 2))

  // if (recordsAll2.length) {
  //   recordsAll2.forEach(async (item: IRecord) => {
  //     const res3 = await env.delete(item.recordId as string)
  //     console.log('删除单条记录res3:', JSON.stringify(res3, null, 2))
  //   })
  // }

  const recordsAll3 = await env.findAll();
  console.log('获取全部记录recordsAll3:', JSON.stringify(recordsAll3));

  const recordsAll41: IRecord[] = recordsAll3.data as IRecord[];

  const recordsAll4 = recordsAll41.filter(
    (item) =>
      item.fields['name'] === '测试sssss11111' ||
      item.fields['name'] === '测试sssss22222',
  );
  console.log('筛选符合条件的记录recordsAll4:', JSON.stringify(recordsAll4));

  // const ids = recordsAll4.map((item: IRecord) => item.recordId as string)
  // console.log('获取recordsAll4记录ID数组ids:', JSON.stringify(ids))

  // if (ids.length) {
  //   const res4 = await env.deleteBatch(ids)
  //   console.log('批量删除记录res4:', JSON.stringify(res4))
  // } else {
  //   console.log('没有记录需要删除...')
  // }

  const newRecord0 = recordsAll4[0] as IRecord;
  const newRecord1 = recordsAll4[1] as IRecord;

  newRecord0.fields['name'] =
    '测试sssss11111-修改' + new Date().toLocaleString();
  newRecord1.fields['name'] =
    '测试sssss22222-修改' + new Date().toLocaleString();

  const recordsAll5 = await env.updatEmultiple(recordsAll4);
  console.log('批量更新记录recordsAll5:', JSON.stringify(recordsAll5));

  const newRecord2 = recordsAll4[2] as IRecord;
  newRecord2.fields['name'] =
    '测试sssss333333-修改' + new Date().toLocaleString();

  const recordsAll6 = await env.update(
    newRecord2.record_id as string,
    newRecord2.fields,
  );
  console.log('更新单条记录recordsAll6:', JSON.stringify(recordsAll6));

  // 删除测试数据
  const ids = recordsAll4.map((item: IRecord) => item.recordId as string);
  console.log('获取recordsAll4记录ID数组ids:', JSON.stringify(ids));
  if (ids.length) {
    const res4 = await env.deleteBatch(ids);
    console.log('批量删除记录res4:', JSON.stringify(res4));
  }

  const recordsAll7 = await env.findByField('name', 'Wechaty-Puppet');
  console.log('根据字段查询recordsAll7:', JSON.stringify(recordsAll7));

  class Messages extends BaseEntity {
    timeHms?: string;

    name?: string;

    alias?: string;

    topic?: string;

    listener?: string;

    messagePayload?: string;

    file?: any;

    messageType?: string;

    wxid?: string;

    roomid?: string;

    messageId?: string;

    wxAvatar?: string;

    roomAvatar?: string;

    listenerAvatar?: string;

    // protected static override recordId: string = ''  // 定义记录ID，初始为空字符串

    protected override mappingOptions: MappingOptions = {
      // 定义字段映射选项
      fieldMapping: {
        // 字段映射
        timeHms: '时间|timeHms',
        name: '发送者|name',
        alias: '好友备注|alias',
        topic: '群名称|topic',
        listener: '接收人|listener',
        messagePayload: '消息内容|messagePayload',
        file: '文件图片|file',
        messageType: '消息类型|messageType',
        wxid: '好友ID|wxid',
        listenerid: '接收人ID|listenerid',
        roomid: '群ID|roomid',
        messageId: '消息ID|messageId',
        wxAvatar: '发送者头像|wxAvatar',
        roomAvatar: '群头像|roomAvatar',
        listenerAvatar: '接收人头像|listenerAvatar',
      },
      tableName: '消息记录|Message', // 表名
    }; // 设置映射选项为上面定义的 mappingOptions

    protected override getMappingOptions(): MappingOptions {
      // 获取映射选项的方法
      return this.mappingOptions; // 返回当前类的映射选项
    }

    override setMappingOptions(options: MappingOptions) {
      // 设置映射选项的方法
      this.mappingOptions = options; // 更新当前类的映射选项
    }
  }

  const messages = new Messages();
  await messages.setVikaOptions({
    apiKey: process.env.VIKA_TOKEN || '',
    baseId: db.dataBaseIds.messageSheet, // 设置 base ID
  });

  // const file = await messages.upload('/Users/luyuchao/Documents/GitHub/chatflow/tools/order_20_47_20.xlsx')
  // console.log('上传文件recordsAll8:', JSON.stringify(file))

  const file = await messages.upload(
    '/Users/luyuchao/Documents/GitHub/chatflow/data/media/image/qrcode/qrcode.png',
  );
  console.log('上传文件recordsAll8:', JSON.stringify(file));

  const record9 = {
    timeHms: new Date().toLocaleString(),
    name: 'Wechaty-Puppet',
    alias: 'Wechaty-Puppet',
    topic: 'Wechaty-Puppet',
    listener: 'Wechaty-Puppet',
    file: [file.data],
  };
  const recordsAll9 = await messages.create(record9);
  console.log('创建单条记录recordsAll9:', JSON.stringify(recordsAll9));
}

main().catch(console.error);
