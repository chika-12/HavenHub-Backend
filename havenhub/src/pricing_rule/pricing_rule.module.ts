import { Module } from '@nestjs/common';
import { PricingRuleService } from './pricing_rule.service';
import { PricingRuleController } from './pricing_rule.controller';

@Module({
  providers: [PricingRuleService],
  controllers: [PricingRuleController]
})
export class PricingRuleModule {}
