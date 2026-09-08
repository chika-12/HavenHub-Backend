import { Controller, Post, Patch, Get, Body, Param } from '@nestjs/common';
import { RolePermissionsService } from './role-permissions.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolePermissionDto } from './dto/rolePermissions.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
@Controller('role-permissions')
export class RolePermissionsController {
  constructor(private readonly rolePermissionService: RolePermissionsService) {}

  @Post()
  async create(
    @Body() data: RolePermissionDto,
    @CurrentUser() user: { sub: string },
  ) {
    return this.rolePermissionService.create(data, user.sub);
  }

  @Get('/:id')
  async findOne(@Param('id') rolePerm: string) {
    return this.rolePermissionService.findOne(rolePerm);
  }

  @Patch('/:id/update')
  async update(
    @Body() data: Partial<RolePermissionDto>,
    @CurrentUser() user: { sub: string },
    @Param('id') rolePermId: string,
  ) {
    return this.rolePermissionService.update(rolePermId, data, user.sub);
  }

  @Patch('/:id/deactivate')
  async deactivate(
    @Param('id') rolePerm: string,
    @CurrentUser() user: { sub: string },
  ) {
    return this.rolePermissionService.deactivateRolePermission(
      rolePerm,
      user.sub,
    );
  }

  @Patch('/:id/reactivate')
  async reactivate(
    @Param('id') rolePerm: string,
    @CurrentUser() user: { sub: string },
  ) {
    return this.rolePermissionService.reactivateRolePermission(
      rolePerm,
      user.sub,
    );
  }
}
