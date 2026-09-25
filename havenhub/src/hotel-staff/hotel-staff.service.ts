import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHotelStaffDTO } from './dto/createHotelStaff.dto';
import { HotelStaff } from './entities/hotelStaff.entities';
import { HotelService } from 'src/hotel/hotel.service';
import { UsersService } from 'src/users/users.service';
import { RoleService } from 'src/role/role.service';
import { UpdateHotelStaffDto } from './dto/createHotelStaff.dto';

@Injectable()
export class HotelStaffService {
  constructor(
    @InjectRepository(HotelStaff)
    private hotelStaffRepository: Repository<HotelStaff>,
    private readonly userService: UsersService,
    private readonly roleService: RoleService,
    private readonly hotelService: HotelService,
  ) {}
  async createStaff(
    data: CreateHotelStaffDTO,
    userId: string,
    hotelId:string,
  ): Promise<HotelStaff> {
    const newUser = await this.findUser(data.user);
    const role = await this.roleService.findOne(data.role, hotelId);
    const hotel = await this.hotelService.findOne(hotelId);
    const admin = await this.findUser(userId);
    const staff = this.hotelStaffRepository.create({
      user: newUser,
      role: role,
      hotel: hotel,
      createdBy: admin,
    });
    return await this.hotelStaffRepository.save(staff);
  }
  async findUser(userId: string) {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }
    return user;
  }
  async findActiveStaff(
    userId: string,
    hotelId: string,
  ): Promise<HotelStaff | null> {
    return this.hotelStaffRepository.findOne({
      where: {
        user: { id: userId },
        hotel: { id: hotelId },
        status: 'active',
      },
      relations: ['role'],
    });
  }
  async updateStaff(
    staffId: string,
    data: UpdateHotelStaffDto,
    updatedByStaffId: string,
    hotelId: string,
  ): Promise<HotelStaff> {
    const staff = await this.hotelStaffRepository.findOne({
      where: { id: staffId, hotel: { id: hotelId } },
    });
    if (!staff) {
      throw new NotFoundException('Staff not found');
    }
    if (data.role) {
      const newRole = await this.roleService.findOne(data.role, hotelId);
      if (!newRole) {
        throw new NotFoundException('This role does not exist');
      }
      staff.role = newRole;
    }
    if (data.status !== undefined) staff.status = data.status;
    const admin = await this.findUser(updatedByStaffId);
    staff.updatedBy = admin;
    return await this.hotelStaffRepository.save(staff);
  }

  async deleteStaff(
    staffId: string,
    hotelId: string,
    deletedByUserId: string,
  ): Promise<void> {
    const staff = await this.hotelStaffRepository.findOne({
      where: { id: staffId, hotel: { id: hotelId } },
    });
    if (!staff) {
      throw new NotFoundException('Staff not found');
    }
    const admin = await this.findUser(deletedByUserId);
    staff.deletedBy = admin;
    await this.hotelStaffRepository.softRemove(staff);
  }
  async findAll(hotelId: string): Promise<HotelStaff[]> {
    return this.hotelStaffRepository.find({
      where: { hotel: { id: hotelId } },
      relations: ['user', 'role'],
    });
  }
}
