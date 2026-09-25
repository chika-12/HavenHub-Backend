// auth/guards/roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ROLES_KEY } from '../roles.decorator';
//import { HavenhubStaffUserRole } from '../../role/entities/havenhubRole.entity'
import { RoleService } from 'src/role/role.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private staffRoleRepo: RoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles?.length) return true;

    const request = context.switchToHttp().getRequest<{
      user?: { sub?: string; userId?: string };
    }>();
    if (!request.user) {
      throw new NotFoundException('User does not exist');
    }
    const userId = request.user.sub;
    if (!userId) throw new ForbiddenException('Not authenticated');

    const staffRoles = await this.staffRoleRepo.getUserSystemRoles(userId);
    const hasRequiredRole = staffRoles.some(
      (sr) => sr.role.is_system_role && requiredRoles.includes(sr.role.name),
    );

    if (!hasRequiredRole) {
      throw new ForbiddenException('Insufficient permissions');
    }
    return true;
  }
}
