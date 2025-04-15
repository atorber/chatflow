import { Test, TestingModule } from '@nestjs/testing';
import { CopilotController } from './copilot.controller';

describe('CopilotController', () => {
  let controller: CopilotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CopilotController],
    }).compile();

    controller = module.get<CopilotController>(CopilotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
