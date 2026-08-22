// hotel.dto.ts
import {
  IsUUID,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
  IsNotEmpty,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto, UpdateAddressDto } from 'src/address/dto/address.dto';

export class CreateHotelDto {
  @IsString({ message: 'Hotel name must be a valid text string.' })
  @IsNotEmpty({ message: 'Hotel name is required.' })
  @MaxLength(100, { message: 'Hotel name cannot exceed 100 characters.' })
  name!: string;

  @IsObject({ message: 'Address must be a valid object.' })
  @ValidateNested({ message: 'Address data is invalid.' })
  @Type(() => AddressDto)
  address!: AddressDto;

  @IsString({ message: 'Phone number must be a valid text string.' })
  @IsNotEmpty({ message: 'Phone number is required.' })
  @MaxLength(100, { message: 'Phone number cannot exceed 100 characters.' })
  phone!: string;

  @IsEmail({}, { message: 'Please provide a valid email address.' })
  @IsNotEmpty({ message: 'Email address is required.' })
  email!: string;

  @IsOptional()
  @IsString({ message: 'Logo URL must be a valid text string.' })
  logoUrl?: string;

  @IsOptional()
  @IsUUID('all', { message: 'Organisation ID must be a valid UUID.' })
  organisationId?: string;
}

export class UpdateHotelDto {
  @IsOptional()
  @IsString({ message: 'Hotel name must be a valid text string.' })
  @MaxLength(100, { message: 'Hotel name cannot exceed 100 characters.' })
  name?: string;

  @IsOptional()
  @IsObject({ message: 'Address must be a valid object.' })
  @ValidateNested({ message: 'Address data is invalid.' })
  @Type(() => UpdateAddressDto)
  address?: UpdateAddressDto;

  @IsOptional()
  @IsString({ message: 'Phone number must be a valid text string.' })
  @MaxLength(100, { message: 'Phone number cannot exceed 100 characters.' })
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Logo URL must be a valid text string.' })
  logoUrl?: string;
}
