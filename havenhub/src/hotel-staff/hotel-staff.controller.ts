import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { HotelStaffService } from './hotel-staff.service';
import {
  CreateHotelStaffDTO,
  UpdateHotelStaffDto,
} from './dto/createHotelStaff.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolePermissionGuard } from 'src/auth/guards/permisssions.guard';
import { RequiresAnyPermission } from 'src/auth/rolePermission.decorator';

@UseGuards(JwtAuthGuard)
@Controller('hotel-staff')
export class HotelStaffController {
  constructor(private readonly hotelStaffService: HotelStaffService) {}

  @Post('/:hotelId')
  @UseGuards(RolePermissionGuard)
  @RequiresAnyPermission('Assign Hotel Roles')
  async createStaff(
    @Body() data: CreateHotelStaffDTO,
    @Param('hotelId') hotelId: string,
    @CurrentUser() user: { sub: string },
  ) {
    return await this.hotelStaffService.createStaff(data, user.sub, hotelId);
  }
  @Patch('/update/:hotelId/:staffId')
  async update(
    @Body() data: UpdateHotelStaffDto,
    @Param('hotelId') hotelId: string,
    @Param('staffId') staffId: string,
    @CurrentUser() user: { sub: string },
  ) {
    return await this.hotelStaffService.updateStaff(
      staffId,
      data,
      user.sub,
      hotelId,
    );
  }
  @Get('/all-hotel-staff/:hotelId')
  async findAllHotelStaffs(@Param('hotelId') hotelId: string) {
    return await this.hotelStaffService.findAll(hotelId);
  }
  @Get('/:hotelId/:id')
  async findActiveStaff(
    @Param('hotelId') hotelId: string,
    @Param('id') userId: string,
  ) {
    return await this.hotelStaffService.findActiveStaff(userId, hotelId);
  }

  @Delete('/delete-user/:staffId/:hotelId')
  async deleteUser(
    @Param('staffId') staffId: string,
    @Param('hotelId') hotelId: string,
    @CurrentUser() user: { sub: string },
  ) {
    return await this.hotelStaffService.deleteStaff(staffId, hotelId, user.sub);
  }
}
