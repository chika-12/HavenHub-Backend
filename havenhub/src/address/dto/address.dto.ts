// address.dto.ts
import { IsString, Length, IsOptional, IsNotEmpty } from 'class-validator';

export class AddressDto {
  @IsString({ message: 'The country field must be a valid text string.' })
  @Length(3, 50, {
    message: 'Country name must be between 3 and 50 characters long.',
  })
  @IsNotEmpty({ message: 'Country is required' })
  country!: string;

  @IsString({ message: 'State must be a valid string.' })
  @Length(3, 50, { message: 'State must range from 3 to 50 characters' })
  @IsNotEmpty({ message: 'State is required ' })
  state!: string;

  @IsString({ message: 'Street must be a valid text string.' })
  @IsNotEmpty({ message: 'Street address is required.' })
  @Length(3, 100, { message: 'Street must be between 3 and 100 characters.' })
  street!: string;

  @IsString({ message: 'City must be a valid text string.' })
  @IsNotEmpty({ message: 'City name is required.' })
  @Length(2, 50, { message: 'City must be between 2 and 50 characters.' })
  city!: string;

  @IsString({ message: 'Postal code must be a valid text string.' })
  @IsNotEmpty({ message: 'Postal code is required.' })
  @Length(3, 10, {
    message: 'Postal code must be between 3 and 10 characters.',
  })
  postalCode!: string;
}

// Update Address DTO - all fields optional for partial updates
export class UpdateAddressDto {
  @IsOptional()
  @IsString({ message: 'The country field must be a valid text string.' })
  @Length(3, 50, {
    message: 'Country name must be between 3 and 50 characters long.',
  })
  country?: string;

  @IsOptional()
  @IsString({ message: 'State must be a valid string.' })
  @Length(3, 50, { message: 'State must range from 3 to 50 characters' })
  state?: string;

  @IsOptional()
  @IsString({ message: 'Street must be a valid text string.' })
  @Length(3, 100, { message: 'Street must be between 3 and 100 characters.' })
  street?: string;

  @IsOptional()
  @IsString({ message: 'City must be a valid text string.' })
  @Length(2, 50, { message: 'City must be between 2 and 50 characters.' })
  city?: string;

  @IsOptional()
  @IsString({ message: 'Postal code must be a valid text string.' })
  @Length(3, 10, {
    message: 'Postal code must be between 3 and 10 characters.',
  })
  postalCode?: string;
}
