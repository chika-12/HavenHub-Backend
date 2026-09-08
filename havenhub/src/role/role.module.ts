import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { UsersModule } from 'src/users/users.module';
import { HavenhubStaffUserRole } from './entities/havenhubRole.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, HavenhubStaffUserRole]),
    UsersModule,
  ],
  providers: [RoleService],
  controllers: [RoleController],
  exports: [RoleService],
})
export class RoleModule {}
