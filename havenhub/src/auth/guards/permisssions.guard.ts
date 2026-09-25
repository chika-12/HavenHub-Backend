import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_PERMISSION_KEY } from '../rolePermission.decorator';
import { RolePermissionsService } from 'src/role-permissions/role-permissions.service';
import { HotelStaffService } from 'src/hotel-staff/hotel-staff.service';

@Injectable()
export class RolePermissionGuard implements CanActivate {
  constructor(
    private readonly rolePermissionService: RolePermissionsService,
    private readonly hotelStaffService: HotelStaffService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      ROLE_PERMISSION_KEY,
      context.getHandler(),
    );
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const userId = request.user.sub;
    const hotelId = request.params.hotelId;

    const staff = await this.hotelStaffService.findActiveStaff(userId, hotelId);
    if (!staff) {
      throw new ForbiddenException(
        'You are not permitted to carry out this operation',
      );
    }

    for (const permission of requiredPermissions) {
      const allowed = await this.rolePermissionService.hasPermission(
        staff.role.id,
        permission,
      );
      if (allowed) {
        return true;
      }
    }
    throw new ForbiddenException(
      'You are not permitted to carry out this operation',
    );
  }
}
