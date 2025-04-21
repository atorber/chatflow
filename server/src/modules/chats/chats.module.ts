import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';

@Module({
  controllers: [ChatsController],
  providers: [ChatsService],
})
export class ChatsModule {}
