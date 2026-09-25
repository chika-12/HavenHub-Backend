import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateRoomTypeDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  basePrice!: number;

  @IsInt()
  @Min(1)
  totalUnits!: number;

  @IsInt()
  @Min(1)
  maxOccupancy!: number;
}
