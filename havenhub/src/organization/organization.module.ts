import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organisation.entity';

@Module({
  providers: [OrganizationService],
  controllers: [OrganizationController],
  imports: [TypeOrmModule.forFeature([Organization])],
  exports: [],
})
export class OrganizationModule {}
