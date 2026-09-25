import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomType } from './entity/room.entity';
import { HotelModule } from 'src/hotel/hotel.module';
//import { RolePermissionsModule } from 'src/role-permissions/role-permissions.module';
import { AuthModule } from 'src/auth/auth.module';
import { RolePermissionsModule } from 'src/role-permissions/role-permissions.module';
import { HotelStaffModule } from 'src/hotel-staff/hotel-staff.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomType]),
    HotelModule,
    AuthModule,
    RolePermissionsModule,
    HotelStaffModule,
  ],
  controllers: [RoomsController],
  providers: [RoomsService],

  exports: [RoomsModule],
})
export class RoomsModule {}
