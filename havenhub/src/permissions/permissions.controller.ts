import {
  Controller,
  Post,
  Get,
  Delete,
  Put,
  Body,
  Param,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreatePermissionDto } from './dto/permsion.dto';

@Controller('permissions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
export class PermissionsController {
  constructor(private readonly permissionService: PermissionsService) {}
  @Post()
  create(@Body() dto: CreatePermissionDto) {
    return this.permissionService.createPermission(dto);
  }
  @Get('all')
  findAllPermission() {
    return this.permissionService.findAllPermission();
  }
  @Delete('/:id')
  deletePermission(@Param('id') permissionId: string) {
    return this.permissionService.removePermissions(permissionId);
  }
  @Put('/:id')
  updatePermission(
    @Body() dto: CreatePermissionDto,
    @Param('id') permissionId: string,
  ) {
    return this.permissionService.updatePermssion(dto, permissionId);
  }
  @Get('/:id')
  findOne(@Param('id') permissionId: string) {
    return this.permissionService.findOnePermission(permissionId);
  }
}
