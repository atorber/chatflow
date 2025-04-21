import { Test, TestingModule } from '@nestjs/testing';
import { KeywordsController } from './keywords.controller';

describe('KeywordsController', () => {
  let controller: KeywordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KeywordsController],
    }).compile();

    controller = module.get<KeywordsController>(KeywordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
