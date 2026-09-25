import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { CreateRoomTypeDto } from './dto/create-room.dto';
import { RoomsService } from './rooms.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { RequiresAnyPermission } from 'src/auth/rolePermission.decorator';
import { RolePermissionGuard } from 'src/auth/guards/permisssions.guard';
import { UpdateRoomTypeDto } from './dto/update-room.dto';

@UseGuards(JwtAuthGuard, RolePermissionGuard)
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @RequiresAnyPermission('Assign Hotel Roles', 'Manage Room Inventory')
  @Post('/:hotelId')
  async create(
    @Body() data: CreateRoomTypeDto,
    @Param('hotelId') hotelId: string,
    @CurrentUser() user: { sub: string },
  ) {
    return await this.roomsService.create(data, user.sub, hotelId);
  }
  //@RequiresAnyPermission('View Rooms')
  @Get('/:hotelId')
  async findAllByHotel(@Param('hotelId') hotelId: string) {
    return await this.roomsService.findAllByHotel(hotelId);
  }

  @Get('/:hotelId/:roomId')
  async findOne(
    @Param('hotelId') hotelId: string,
    @Param('roomId') roomId: string,
  ) {
    return await this.roomsService.findOne(hotelId, roomId);
  }
  //@RequiresAnyPermission('Edit Custom Hotel Role')
  @Patch('/update/:hotelId/:roomId')
  async update(
    @Body() data: UpdateRoomTypeDto,
    @Param('hotelId') hotelId: string,
    @Param('roomId') roomId: string,
    @CurrentUser() user: { sub: string },
  ) {
    return await this.roomsService.update(data, user.sub, hotelId, roomId);
  }
  @Delete('/delete/:hotelId/:roomId')
  async softDelete(
    @Param('hotelId') hotelId: string,
    @Param('roomId') roomId: string,
    @CurrentUser() user: { sub: string },
  ) {
    return await this.roomsService.softDelete(user.sub, hotelId, roomId);
  }
}
