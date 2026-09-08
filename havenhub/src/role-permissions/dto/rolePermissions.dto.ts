import { IsUUID, IsString } from 'class-validator';

export class RolePermissionDto {
  @IsUUID()
  @IsString()
  permissionId!: string;

  @IsUUID()
  @IsString()
  roleId!: string;
}
