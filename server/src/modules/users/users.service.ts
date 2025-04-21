import { Injectable } from '@nestjs/common';
import { Store } from '../../db/store';

export type User = any;

@Injectable()
export class UsersService {
  async findUser(username: string): Promise<User | undefined> {
    return Store.users.find(
      (user) => user.username === username || user.spaceName === username,
    );
  }
}
