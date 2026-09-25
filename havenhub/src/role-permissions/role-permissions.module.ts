import { Module } from '@nestjs/common';
import { RolePermissionsService } from './role-permissions.service';
import { RolePermissionsController } from './role-permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermissionEntity } from './entity/rolePermissions.entity';
import { RoleModule } from 'src/role/role.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { UsersModule } from 'src/users/users.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([RolePermissionEntity]),
    RoleModule,
    PermissionsModule,
    UsersModule,
  ],
  providers: [RolePermissionsService],
  controllers: [RolePermissionsController],
  exports: [RolePermissionsService],
})
export class RolePermissionsModule {}
