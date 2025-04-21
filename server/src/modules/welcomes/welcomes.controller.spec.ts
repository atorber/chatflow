import { Test, TestingModule } from '@nestjs/testing';
import { WelcomesController } from './welcomes.controller';

describe('WelcomesController', () => {
  let controller: WelcomesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WelcomesController],
    }).compile();

    controller = module.get<WelcomesController>(WelcomesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
