import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entity/permissions.entity';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([Permission]), RoleModule],
  providers: [PermissionsService],
  controllers: [PermissionsController],
  exports: [PermissionsService],
})
export class PermissionsModule {}
