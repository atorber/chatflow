import { BaseEntity, MappingOptions } from '../../mod.js';

export class Medias extends BaseEntity {
  name: string;
  type: string;
  link: string;
  link1: string;
  state: string;

  syncStatus: string;
  lastOperationTime: number;
  action: string;

  // protected static override recordId: string = ''  // 定义记录ID，初始为空字符串

  protected override mappingOptions: MappingOptions = {
    // 定义字段映射选项
    fieldMapping: {
      // 字段映射
      name: '名字',
      type: '类型',
      link: '链接',
      link1: '链接1',
      state: '启用状态|state',

      syncStatus: '同步状态|syncStatus',
      lastOperationTime: '最后操作时间|lastOperationTime',
      action: '操作|action',
    },
    tableName: '媒体资源|Media', // 表名
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
