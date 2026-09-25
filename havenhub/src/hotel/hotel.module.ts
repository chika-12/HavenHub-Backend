import { Module } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { HotelController } from './hotel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from './entities/hotel.entity';
import { AddressModule } from 'src/address/address.module';
//import { AuthModule } from 'src/auth/auth.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { UsersModule } from 'src/users/users.module';
import { RoleModule } from 'src/role/role.module';
import { RolePermissionsModule } from 'src/role-permissions/role-permissions.module';

@Module({
  providers: [HotelService],
  controllers: [HotelController],
  imports: [
    TypeOrmModule.forFeature([Hotel]),
    AddressModule,
    RoleModule,
    PermissionsModule,
    UsersModule,
    RolePermissionsModule
  ],
  exports: [HotelService],
})
export class HotelModule {}
