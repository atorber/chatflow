import { Test, TestingModule } from '@nestjs/testing';
import { ChatsController } from './chats.controller';

describe('ChatsController', () => {
  let controller: ChatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatsController],
    }).compile();

    controller = module.get<ChatsController>(ChatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
