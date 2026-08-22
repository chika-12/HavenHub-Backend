import { Injectable } from '@nestjs/common';
import { Address } from './entities/address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { AddressDto } from './dto/address.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    private userServive: UsersService,
  ) {}
  async createAddress(
    addressData: AddressDto,
    manager?: EntityManager,
  ): Promise<Address> {
    const repo = manager
      ? manager.getRepository(Address)
      : this.addressRepository;
    const address = repo.create({
      ...addressData,
    } as Address);

    return await repo.save(address);
  }
}
