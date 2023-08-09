export interface Plugin {
    init(app: any): void;
    enable(app: any): void;
    disable(app: any): void;
  }

enum PluginType {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6
}

export interface PluginConfig {
  name: string;
  active: boolean;
  type: PluginType;
  room?: any;
  contact?: any;
  params?:any;
}
