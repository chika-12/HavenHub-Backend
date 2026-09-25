import { Module } from '@nestjs/common';
import { HotelStaffService } from './hotel-staff.service';
import { HotelStaffController } from './hotel-staff.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotelStaff } from './entities/hotelStaff.entities';
import { UsersModule } from 'src/users/users.module';
import { HotelModule } from 'src/hotel/hotel.module';
import { RoleModule } from 'src/role/role.module';
import { RolePermissionsModule } from 'src/role-permissions/role-permissions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HotelStaff]),
    UsersModule,
    HotelModule,
    RoleModule,
    RolePermissionsModule,
  ],
  providers: [HotelStaffService],
  controllers: [HotelStaffController],
  exports: [HotelStaffService],
})
export class HotelStaffModule {}
