import { BaseEntity, MappingOptions } from '../../mod.js';

export class Keywords extends BaseEntity {
  desc?: string; // 定义名字属性，可选
  name?: string;
  type?: string;
  details?: string;

  // protected static override recordId: string = ''  // 定义记录ID，初始为空字符串

  protected override mappingOptions: MappingOptions = {
    // 定义字段映射选项
    fieldMapping: {
      // 字段映射
      name: '指令名称|name',
      desc: '说明|desc',
      type: '类型|type',
      details: '详细说明|details',
    },
    tableName: '关键词|Keyword', // 表名
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
