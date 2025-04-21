import { Test, TestingModule } from '@nestjs/testing';
import { CopilotService } from './copilot.service';

describe('CopilotService', () => {
  let service: CopilotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CopilotService],
    }).compile();

    service = module.get<CopilotService>(CopilotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
