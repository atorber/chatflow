import { BaseEntity, MappingOptions } from '../../mod.js';

export class Statistics extends BaseEntity {
  _id?: string; // 定义名字属性，可选
  type?: string;
  desc?: string;
  startTime?: number;
  duration?: number;
  maximum?: number;
  location?: string;
  cycle?: number;
  topic?: string;
  roomid?: string;
  active?: string;

  syncStatus?: string;
  lastOperationTime?: string;
  action?: string;
  // protected static override recordId: string = ''  // 定义记录ID，初始为空字符串

  protected override mappingOptions: MappingOptions = {
    // 定义字段映射选项
    fieldMapping: {
      // 字段映射
      _id: '编号|_id',
      type: '类型|type',
      desc: '描述|desc',
      startTime: '开始时间(选填)|startTime',
      duration: '时长(小时，选填)|duration',
      maximum: '限制人数(选填)|maximum',
      location: '地点(选填)|location',
      cycle: '周期(选填)|cycle',
      topic: '关联群名称|topic',
      roomid: '关联群ID(选填)|roomid',
      active: '启用状态|active',
      syncStatus: '同步状态|syncStatus',
      lastOperationTime: '最后操作时间|lastOperationTime',
      action: '操作|action',
    },
    tableName: '问答列表|Qa', // 表名
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
