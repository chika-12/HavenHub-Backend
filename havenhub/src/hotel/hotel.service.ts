import { Injectable } from '@nestjs/common';
import { AddressService } from 'src/address/address.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Hotel } from './entities/hotel.entity';
import { CreateHotelDto } from './dto/createHotel.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
    private addressService: AddressService,
    private readonly usersService: UsersService,
    private dataSource: DataSource,
  ) {}
  async createHotel(data: CreateHotelDto, userId: string): Promise<Hotel> {
    const createdBy = await this.usersService.findUserById(userId);
    return this.dataSource.transaction(async (manager) => {
      const address = await this.addressService.createAddress(
        data.address,
        manager,
      );

      const hotelRepo = manager.getRepository(Hotel);
      const hotel = hotelRepo.create({
        name: data.name,
        phone: data.phone,
        email: data.email,
        logoUrl: data.logoUrl,
        organisation: data.organisationId ? { id: data.organisationId } : null,
        address,
        createdBy: createdBy ?? undefined,
      });

      return hotelRepo.save(hotel);
    });
  }
}
