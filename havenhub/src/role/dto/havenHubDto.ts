// create-havenhub-staff-user-role.dto.ts
import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateHavenhubStaffUserRoleDto {
  @IsUUID()
  @IsNotEmpty()
  user_id!: string;

  @IsUUID()
  @IsNotEmpty()
  role_id!: string;
}
