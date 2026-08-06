// permissions/dto/create-permission.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  Length,
} from 'class-validator';
import { PermissionScope } from '../entity/permissions.entity';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  permission_name!: string;

  @IsEnum(PermissionScope)
  @IsNotEmpty()
  scope!: PermissionScope;

  @IsString()
  @IsOptional()
  description?: string;
}
