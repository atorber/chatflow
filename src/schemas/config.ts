type AppConfig = {
    config: Record<string, any>;
    isOpen: boolean;
  };

  type AppConfigs = {
    [appName: string]: AppConfig;
  };

  type BotConfig = {
    adminRoomId: string;
    adminRoomTopic: string;
    apps: AppConfigs;
    bot: {
      puppet: string;
      token: string;
      [key : string]:any
    };
    command: {
      contact: Record<string, any>;
      room: Record<string, any>;
      bot: Record<string, any>;
    };
  };

  type ContactConfig = {
    [contactId: string]: {
      app: string;
      apps: AppConfigs;
    };
  };

  type RoomConfig = {
    [roomId: string]: {
      app: string;
      apps: AppConfigs;
    };
  };

  type Config = {
    botConfig: BotConfig;
    contactConfig: ContactConfig;
    roomConfig: RoomConfig;
  };

export {
  type AppConfig,
  type AppConfigs,
  type BotConfig,
  type ContactConfig,
  type RoomConfig,
  type Config,
}
