import { BaseEntity, MappingOptions } from '../../mod.js';

export class Groupnotices extends BaseEntity {
  text: string; // 内容
  type: string; // 类型
  alias: string; // 好友备注(选填)
  name: string; // 昵称/群名称
  id: string; // 好友ID/群ID(选填)
  state: string; // 状态
  pubTime: string; // 发送时间
  info: string; // 信息
  syncStatus: string; // 同步状态
  lastOperationTime: string; // 最后操作时间
  action: string; // 操作

  // protected static override recordId: string = ''  // 定义记录ID，初始为空字符串

  protected override mappingOptions: MappingOptions = {
    // 定义字段映射选项
    fieldMapping: {
      // 字段映射
      text: '内容|text',
      type: '类型|type',
      alias: '好友备注(选填)|alias',
      name: '昵称/群名称|name',
      id: '好友ID/群ID(选填)|id',
      state: '状态|state',
      pubTime: '发送时间|pubTime',
      info: '信息|info',
      syncStatus: '同步状态|syncStatus',
      lastOperationTime: '最后操作时间|lastOperationTime',
      action: '操作|action',
    },
    tableName: '群发通知|GroupNotice', // 表名
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
