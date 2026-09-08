import { SetMetadata } from '@nestjs/common';

export const ROLE_PERMISSION_KEY = 'roles_permissions';
export const RequiresAnyPermission = (...roles_permissions: string[]) =>
  SetMetadata(ROLE_PERMISSION_KEY, roles_permissions);
