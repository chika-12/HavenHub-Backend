import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
  Request,
  Get,
  Delete,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleService } from './role.service';
import { CreateHavenhubStaffUserRoleDto } from './dto/havenHubDto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';

/**
 * RoleController
 *
 * Handles HavenHub system role management — creating system-defined roles
 * and assigning them to HavenHub staff via havenhub_staff_user_roles.
 *
 * All endpoints are restricted to users holding the SUPER_ADMIN system role
 * (enforced by RolesGuard, which checks is_system_role = true on the
 * assigned role — hotel-scoped roles never satisfy this check).
 *
 * Note: this controller does NOT handle hotel-created custom roles —
 * those belong to a hotel-scoped roles endpoint/module, not here.
 */
@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }

  // Assigns a system role to a HavenHub staff member
  @Post('assign')
  assignSystemRole(@Body() dto: CreateHavenhubStaffUserRoleDto) {
    return this.roleService.createHavenHubStaffRoles(dto);
  }

  @Get()
  findAllSystemRoles() {
    return this.roleService.findAllSystemRoles();
  }

  @Get('havenhub-staff')
  findAllHavenHubStaffRoles() {
    return this.roleService.findAllHavenHubStaff();
  }

  @Get('hotel/:hotelId')
  findAllHotelRoles(@Param('hotelId', ParseUUIDPipe) hotelId: string) {
    return this.roleService.findRolesByHotel(hotelId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.roleService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateRoleDto,
    @Request() req: { user: { sub: string } },
  ) {
    return this.roleService.update(id, dto, req.user.sub);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.roleService.remove(id);
  }

  // Removes all system-role assignments for a HavenHub staff member
  // (Consider moving this to a users/staff controller — it's really
  // about the user's role assignments, not the role entity itself.)
  @Delete('staff/:userId/roles')
  removeStaffRoles(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.roleService.removeAllStaffRoles(userId);
  }
}
