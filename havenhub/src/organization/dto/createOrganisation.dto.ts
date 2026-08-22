// organization.dto.ts
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateOrganizationDto {
  @IsString({ message: 'Organization name must be a valid text string.' })
  @IsNotEmpty({ message: 'Organization name is required.' })
  @MaxLength(100, {
    message: 'Organization name cannot exceed 100 characters.',
  })
  name!: string;

  @IsOptional()
  @IsString({ message: 'Tax ID must be a valid text string.' })
  @MaxLength(100, { message: 'Tax ID cannot exceed 100 characters.' })
  taxId?: string;

  @IsString({
    message: 'Organization registration number must be a valid text string.',
  })
  @IsNotEmpty({ message: 'Organization registration number is required.' })
  @MaxLength(100, {
    message: 'Organization registration number cannot exceed 100 characters.',
  })
  organisationRegNo!: string;
}

export class UpdateOrganizationDto {
  @IsOptional()
  @IsString({ message: 'Organization name must be a valid text string.' })
  @MaxLength(100, {
    message: 'Organization name cannot exceed 100 characters.',
  })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Tax ID must be a valid text string.' })
  @MaxLength(100, { message: 'Tax ID cannot exceed 100 characters.' })
  taxId?: string;

  @IsOptional()
  @IsString({
    message: 'Organization registration number must be a valid text string.',
  })
  @MaxLength(100, {
    message: 'Organization registration number cannot exceed 100 characters.',
  })
  organisationRegNo?: string;

  @IsOptional()
  @IsUUID('all', { message: 'Updated by user ID must be a valid UUID.' })
  updatedBy?: string;
}

// Optional: Response DTO (excludes deletedAt and nested user objects)
export class OrganizationResponseDto {
  id!: string;
  name!: string;
  taxId?: string | null;
  organisationRegNo!: string;
  createdAt!: Date;
  updatedAt!: Date;
  createdBy!: string; // UUID of the creator
  updatedBy?: string | null;
  deletedBy?: string | null;
}
