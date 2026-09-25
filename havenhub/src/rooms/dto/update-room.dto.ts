import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomTypeDto } from './create-room.dto';

export class UpdateRoomTypeDto extends PartialType(CreateRoomTypeDto) {}
