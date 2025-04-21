import { BaseEntity, MappingOptions } from '../../mod.js';

export class Welcomes extends BaseEntity {
  id: string;
  topic: string;
  text: string;
  state: string;

  syncStatus: string;
  lastOperationTime: number;
  action: string;

  // protected static override recordId: string = ''  // 定义记录ID，初始为空字符串

  protected override mappingOptions: MappingOptions = {
    // 定义字段映射选项
    fieldMapping: {
      // 字段映射
      id: '群ID|id',
      topic: '群名称|topic',
      text: '欢迎语|text',
      state: '启用状态|state',

      syncStatus: '同步状态|syncStatus',
      lastOperationTime: '最后操作时间|lastOperationTime',
      action: '操作|action',
    },
    tableName: '进群欢迎语|Welcome', // 表名
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
