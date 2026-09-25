import { IsString, IsUUID, IsNotEmpty, IsOptional } from 'class-validator';
export class CreateHotelStaffDTO {
  @IsString()
  @IsUUID()
  @IsNotEmpty({ message: 'User must not be empty and must be a UUID' })
  user!: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  hotel!: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  role!: string;

  @IsString()
  @IsOptional()
  reasonForStatus!: string;
}
export class UpdateHotelStaffDto {
  @IsUUID()
  @IsOptional()
  @IsString()
  role!: string;

  @IsString()
  @IsOptional()
  status!: string;
}
