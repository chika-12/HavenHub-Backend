/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable prettier/prettier */
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/users.entities';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async createUser(user: CreateUserDto): Promise<User> {
    const existingdata = await this.userRepository.findOne({
      where: { email: user.email },
    });
    if (existingdata) {
      throw new ConflictException('User already exist');
    }
    const data = this.userRepository.create(user);

    return await this.userRepository.save(data);
  }
}
