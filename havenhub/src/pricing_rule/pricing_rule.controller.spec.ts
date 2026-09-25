import { Test, TestingModule } from '@nestjs/testing';
import { PricingRuleController } from './pricing_rule.controller';

describe('PricingRuleController', () => {
  let controller: PricingRuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PricingRuleController],
    }).compile();

    controller = module.get<PricingRuleController>(PricingRuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
