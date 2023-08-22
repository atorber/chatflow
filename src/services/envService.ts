/* eslint-disable sort-keys */

/*
定义一个配置信息管理接口，至少包含以下几个动作，给出ts示例代码：
获取配置信息
更新配置信息
同步配置信息
*/

export interface ConfigManager {
    getConfig(): any;
    updateConfig(config: any): void;
    syncConfig(): void;
  }
