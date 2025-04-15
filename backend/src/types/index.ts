export interface RoomWhiteList {
  qa: BusinessRoom[];
  msg: BusinessRoom[];
  act: BusinessRoom[];
  gpt: BusinessRoom[];
}

export interface ContactWhiteList {
  qa: BusinessUser[];
  msg: BusinessUser[];
  act: BusinessUser[];
  gpt: BusinessUser[];
}

export type BusinessRoom = {
  id?: string;
  luckyDog?: string;
  memberAlias?: string;
  topic: string;
};

export type BusinessUser = {
  alias?: string;
  id?: string;
  name: string;
};
