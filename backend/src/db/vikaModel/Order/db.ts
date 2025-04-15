import { BaseEntity, MappingOptions } from '../../mod.js';

export class Orders extends BaseEntity {
  serialNumber: string; // 定义名字属性，可选
  code: string;
  desc: string;
  name: string;
  alias: string;
  wxid: string;
  topic: string;
  createdAt: string;
  info: string;

  // protected static override recordId: string = ''  // 定义记录ID，初始为空字符串

  protected override mappingOptions: MappingOptions = {
    // 定义字段映射选项
    fieldMapping: {
      // 字段映射
      serialNumber: '编号|serialNumber',
      code: '活动编号|code',
      desc: '活动描述|desc',
      name: '昵称|name',
      alias: '备注名称(选填)|alias',
      wxid: '好友ID(选填)|wxid',
      topic: '群名称|topic',
      createdAt: '创建时间|createdAt',
      info: '备注|info',
    },
    tableName: '记录单|Order', // 表名
  };

  protected override getMappingOptions(): MappingOptions {
    // 获取映射选项的方法
    return this.mappingOptions; // 返回当前类的映射选项
  }

  override setMappingOptions(options: MappingOptions) {
    // 设置映射选项的方法
    this.mappingOptions = options; // 更新当前类的映射选项
  }
}
