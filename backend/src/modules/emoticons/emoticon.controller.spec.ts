import { Test, TestingModule } from '@nestjs/testing';
import { EmoticonController } from './emoticon.controller';

describe('EmoticonController', () => {
  let controller: EmoticonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmoticonController],
    }).compile();

    controller = module.get<EmoticonController>(EmoticonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
