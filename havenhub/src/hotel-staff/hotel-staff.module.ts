import { Module } from '@nestjs/common';
import { HotelStaffService } from './hotel-staff.service';
import { HotelStaffController } from './hotel-staff.controller';

@Module({
  providers: [HotelStaffService],
  controllers: [HotelStaffController]
})
export class HotelStaffModule {}
