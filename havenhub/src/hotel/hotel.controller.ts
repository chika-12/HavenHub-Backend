import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CreateHotelDto } from './dto/createHotel.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('hotel')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Post()
  createHotel(
    @Body() hotelData: CreateHotelDto,
    @CurrentUser() user: { sub: string },
  ) {
    return this.hotelService.createHotel(hotelData, user.sub);
  }
}
