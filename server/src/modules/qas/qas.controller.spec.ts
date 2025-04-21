import { Test, TestingModule } from '@nestjs/testing';
import { QasController } from './qas.controller';

describe('QasController', () => {
  let controller: QasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QasController],
    }).compile();

    controller = module.get<QasController>(QasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
