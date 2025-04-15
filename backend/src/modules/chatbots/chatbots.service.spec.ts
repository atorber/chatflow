import { Test, TestingModule } from '@nestjs/testing';
import { ChatbotsService } from './chatbots.service';

describe('ChatbotsService', () => {
  let service: ChatbotsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatbotsService],
    }).compile();

    service = module.get<ChatbotsService>(ChatbotsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
