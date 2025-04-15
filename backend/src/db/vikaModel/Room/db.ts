import { BaseEntity, MappingOptions } from '../../mod.js';

export class Rooms extends BaseEntity {
  topic?: string; // 定义名字属性，可选

  id?: string;

  alias?: string;

  updated?: string;

  avatar?: string;

  file?: string;

  // protected static override recordId: string = ''  // 定义记录ID，初始为空字符串

  protected override mappingOptions: MappingOptions = {
    // 定义字段映射选项
    fieldMapping: {
      // 字段映射
      id: '群ID|id',
      topic: '群名称|topic',
      ownerId: '群主ID|ownerId',
      updated: '更新时间|updated',
      avatar: '头像|avatar',
      file: '头像图片|file',
    },
    tableName: '群列表|Room', // 表名
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
