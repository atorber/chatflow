import { BaseEntity, MappingOptions } from '../../mod.js';

export class Carpoolings extends BaseEntity {
  /**
   * Type (车找人, 人找车)
   */
  type: '车找人' | '人找车';
  /**
   * Departure location
   */
  departureLocation: string;
  /**
   * Destination
   */
  destination: string;
  /**
   * Departure date
   */
  departureDate: string;
  /**
   * Departure time
   */
  departureTime: string;
  /**
   * Contact phone
   */
  contactPhone: string;
  /**
   * Publisher
   */
  publisher: string;
  /**
   * Car fee
   */
  carFee: string;
  /**
   * Route
   */
  route: string;

  text: string;
  topic: string;
  roomId: string;
  wxid: string;
  createdAt: string;

  state: '开启' | '关闭';

  // protected static override recordId: string = ''  // 定义记录ID，初始为空字符串

  protected override mappingOptions: MappingOptions = {
    // 定义字段映射选项
    fieldMapping: {
      // 字段映射
      /**
       * Type (车找人, 人找车)
       */
      type: '类型',
      /**
       * Departure location
       */
      departureLocation: '出发地',
      /**
       * Destination
       */
      destination: '目的地',
      /**
       * Departure date
       */
      departureDate: '出发日期',
      /**
       * Departure time
       */
      departureTime: '出发时间',
      /**
       * Contact phone
       */
      contactPhone: '联系电话',
      /**
       * Publisher
       */
      publisher: '发布人',
      /**
       * Car fee
       */
      carFee: '车费',
      /**
       * Route
       */
      route: '途经路线',
      text: '原始消息',
      topic: '群名称',
      roomId: '群ID',
      wxid: '发布者ID',
      createdAt: '创建时间',
      state: '状态',
    },
    tableName: '顺风车|Carpooling', // 表名
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
