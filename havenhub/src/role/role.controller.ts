import {
  Body,
  Controller,
  Param,
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
@Controller('role')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
export class RoleController {
  constructor(private roleService: RoleService) {}
  @Post()
  createRole(@Body() dot: CreateRoleDto) {
    return this.roleService.create(dot);
  }
  //Assigns role to HavenHub staff
  @Post('assign/system-role')
  assignSystemRole(@Body() systemRole: CreateHavenhubStaffUserRoleDto) {
    return this.roleService.createHavenHubStaffRoles(systemRole);
  }
  @Put('update-role/:id')
  update_role(
    @Body() dto: CreateRoleDto,
    @Param('id') role_id: string,
    @Request() req: { user: { sub: string } },
  ) {
    return this.roleService.update(role_id, dto, req.user.sub);
  }
  @Get('all')
  findAllSystemRole() {
    return this.roleService.findAllSystemRoles();
  }
  @Get('find-role/:hotelId')
  find_all_hotel_roles(@Param('hotelId') hotelId: string) {
    return this.roleService.findRolesByHotel(hotelId);
  }
  @Get('all-havenhub-role')
  haven_hub_assigned_role() {
    return this.roleService.findAllHavenHubStaff();
  }
  @Get('find-one/:id')
  findOne(@Param('id') role_id: string) {
    return this.roleService.findOne(role_id);
  }
  @Delete('delete/:id')
  deleteRole(@Param('id') role_id: string) {
    return this.roleService.remove(role_id);
  }
  @Delete('delete/system-role/user/:id')
  delete_user_from_havenhub(@Param('id') userId: string) {
    return this.roleService.removeAllStaffRoles(userId);
  }
}
