import { Injectable, NotFoundException } from '@nestjs/common';
import { HotelService } from 'src/hotel/hotel.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomType } from './entity/room.entity';
import { CreateRoomTypeDto } from './dto/create-room.dto';
import { User } from 'src/users/entities/users.entities';
import { Hotel } from 'src/hotel/entities/hotel.entity';
import { UpdateRoomTypeDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(RoomType)
    private roomTypeRepository: Repository<RoomType>,
    private readonly hotelService: HotelService,
  ) {}
  async create(
    data: CreateRoomTypeDto,
    userId: string,
    hotelId: string,
  ): Promise<RoomType> {
    await this.hotelService.findOne(hotelId);
    const room = this.roomTypeRepository.create({
      ...data,
      basePrice: String(data.basePrice),
      createdBy: { id: userId } as User,
      hotel: { id: hotelId } as Hotel,
    });
    return await this.roomTypeRepository.save(room);
  }
  async findAllByHotel(hotelId: string): Promise<RoomType[]> {
    const rooms = await this.roomTypeRepository.find({
      where: { hotel: { id: hotelId } },
    });
    return rooms;
  }
  async findOne(hotelId: string, id: string): Promise<RoomType> {
    const roomType = await this.roomTypeRepository.findOne({
      where: { id, hotel: { id: hotelId } },
    });
    if (!roomType) {
      throw new NotFoundException('Room type not found');
    }
    return roomType;
  }
  async update(
    data: UpdateRoomTypeDto,
    userId: string,
    hotelId: string,
    roomTypeId: string,
  ): Promise<RoomType> {
    await this.findOne(hotelId, roomTypeId);
    const { basePrice, ...roomData } = data;
    const roomType = await this.roomTypeRepository.preload({
      id: roomTypeId,
      ...roomData,
      ...(basePrice !== undefined && {
        basePrice: String(basePrice),
      }),
      updatedBy: { id: userId } as User,
    });
    if (!roomType) {
      throw new NotFoundException('Room type not found');
    }
    const room = await this.roomTypeRepository.save(roomType);

    const { updatedBy, ...roomWithoutUpdatedBy } = room;
    return roomWithoutUpdatedBy;
  }
  async softDelete(userId: string, hotelId: string, id: string) {
    const roomType = await this.findOne(hotelId, id);
    roomType.deletedBy = { id: userId } as User;
    await this.roomTypeRepository.softRemove(roomType);
  }
}
