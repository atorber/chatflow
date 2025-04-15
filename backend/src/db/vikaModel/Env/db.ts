import { BaseEntity, MappingOptions } from '../../mod.js';

export class Env extends BaseEntity {
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
