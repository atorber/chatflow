import { BaseEntity, MappingOptions } from '../../mod.js';

export class Whitelists extends BaseEntity {
  serialNumber: string; // 定义名字属性，可选
  app: string;
  type: string;
  name: string;
  id: string;
  alias: string;
  info: string;
  state: string;
  quota: number;
  adminName: string;
  adminAlias: string;
  adminId: string;

  syncStatus: string;
  lastOperationTime: number;
  action: string;

  // protected static override recordId: string = ''  // 定义记录ID，初始为空字符串

  protected override mappingOptions: MappingOptions = {
    // 定义字段映射选项
    fieldMapping: {
      // 字段映射
      serialNumber: '编号|serialNumber',
      app: '所属应用|app',
      type: '类型|type',
      name: '昵称/群名称|name',
      id: '好友ID/群ID(选填)|id',
      alias: '好友备注(选填)|alias',
      info: '备注说明(选填)|info',
      state: '启用状态|state',
      quota: '配额(选填)|quota',
      adminName: '管理员昵称|adminName',
      adminAlias: '管理员好友备注(选填)|adminAlias',
      adminId: '管理员ID(选填)|adminId',

      syncStatus: '同步状态|syncStatus',
      lastOperationTime: '最后操作时间|lastOperationTime',
      action: '操作|action',
    },
    tableName: '白名单|WhiteList', // 表名
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
