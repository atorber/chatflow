import { Test, TestingModule } from '@nestjs/testing';
import { ChatbotsController } from './chatbots.controller';

describe('ChatbotsController', () => {
  let controller: ChatbotsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatbotsController],
    }).compile();

    controller = module.get<ChatbotsController>(ChatbotsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
