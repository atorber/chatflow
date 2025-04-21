import { BaseEntity, MappingOptions } from '../../mod.js';

export class Notices extends BaseEntity {
  desc?: string; // 定义名字属性，可选

  id?: string;

  name?: string;

  type?: string;

  alias?: string;

  time?: number;

  cycle?: string;

  state?: string;

  syncStatus?: string;

  lastOperationTime?: string;

  action?: string;

  // protected static override recordId: string = ''  // 定义记录ID，初始为空字符串

  protected override mappingOptions: MappingOptions = {
    // 定义字段映射选项
    fieldMapping: {
      // 字段映射
      id: '好友ID/群ID(选填)|id', // 将 id 映射到 '好友ID/群ID(选填)' 字段
      name: '昵称/群名称|name',
      type: '通知目标类型|type',
      desc: '内容|desc',
      alias: '好友备注(选填)|alias',
      time: '时间|time',
      cycle: '周期|cycle',
      state: '启用状态|state',
      syncStatus: '同步状态|syncStatus',
      lastOperationTime: '最后操作时间|lastOperationTime',
      action: '操作|action',
    },
    tableName: '定时提醒|Notice', // 表名
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
