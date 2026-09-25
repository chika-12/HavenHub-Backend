import { Test, TestingModule } from '@nestjs/testing';
import { PricingRuleService } from './pricing_rule.service';

describe('PricingRuleService', () => {
  let service: PricingRuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PricingRuleService],
    }).compile();

    service = module.get<PricingRuleService>(PricingRuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
