// role/role.service.ts
import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { HavenhubStaffUserRole } from './entities/havenhubRole.entity';
import { UsersService } from 'src/users/users.service';
import { CreateHavenhubStaffUserRoleDto } from './dto/havenHubDto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(HavenhubStaffUserRole)
    private havenHubRepository: Repository<HavenhubStaffUserRole>,
    private userService: UsersService,
  ) {}

  async create(dto: CreateRoleDto /*userId: string*/): Promise<Role> {
    // enforce the invariant the DB CHECK constraint would otherwise handle
    if (dto.is_system_role && dto.hotel_id) {
      throw new BadRequestException('System roles cannot have a hotel_id');
    }
    if (!dto.is_system_role && !dto.hotel_id) {
      throw new BadRequestException('Hotel roles must specify a hotel_id');
    }

    // enforce name uniqueness per scope
    const existing = await this.roleRepository.findOne({
      where: dto.is_system_role
        ? { name: dto.name, is_system_role: true }
        : { name: dto.name, hotel_id: dto.hotel_id },
    });
    if (existing) {
      throw new ConflictException(
        dto.is_system_role
          ? `System role "${dto.name}" already exists`
          : `Role "${dto.name}" already exists for this hotel`,
      );
    }

    const role = this.roleRepository.create(dto);
    role.hotel_id = dto.is_system_role ? null : (dto.hotel_id ?? null);

    return this.roleRepository.save(role);
  }
  async findAllSystemRoles(): Promise<Role[]> {
    return this.roleRepository.find({ where: { is_system_role: true } });
  }

  /** All custom roles belonging to a specific hotel. */
  async findRolesByHotel(hotelId: string): Promise<Role[]> {
    return this.roleRepository.find({ where: { hotel_id: hotelId } });
  }
  async findOne(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }
  async update(
    id: string,
    dto: Partial<CreateRoleDto>,
    userId: string,
  ): Promise<Role> {
    const role = await this.findOne(id);

    // don't allow flipping scope after creation — that's a different role, not an edit
    if (
      dto.is_system_role !== undefined &&
      dto.is_system_role !== role.is_system_role
    ) {
      throw new BadRequestException(
        "Cannot change a role's system/hotel scope after creation",
      );
    }

    if (dto.name && dto.name !== role.name) {
      const where = role.is_system_role
        ? { name: dto.name, is_system_role: true }
        : { name: dto.name, hotel_id: role.hotel_id ?? undefined };
      const existing = await this.roleRepository.findOne({ where });
      if (existing) {
        throw new ConflictException(
          `Role "${dto.name}" already exists in this scope`,
        );
      }
    }

    Object.assign(role, dto, { updated_by: userId });
    return this.roleRepository.save(role);
  }
  async remove(id: string): Promise<void> {
    const role = await this.findOne(id);
    // TODO: check for existing hotel_staff / havenhub_staff_user_roles references
    // before hard-deleting — see note below.
    await this.roleRepository.remove(role);
  }

  /*
  The codes below is for assigning roles to HavenHub staffs
  */

  /*
  The code below is for assigning roles to HavenHub staff
*/

  async createHavenHubStaffRoles(
    data: CreateHavenhubStaffUserRoleDto,
  ): Promise<HavenhubStaffUserRole> {
    const user = await this.userService.findUserById(data.user_id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const role = await this.roleRepository.findOne({
      where: { id: data.role_id },
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // this table is for HavenHub staff only — reject anything that isn't a system role
    if (!role.is_system_role) {
      throw new BadRequestException(
        'Only system roles can be assigned to HavenHub staff',
      );
    }

    // prevent duplicate assignment of the same role to the same user
    const existingAssignment = await this.havenHubRepository.findOne({
      where: { user_id: data.user_id, role_id: data.role_id },
    });
    if (existingAssignment) {
      throw new ConflictException('User already has this role assigned');
    }

    const roleAssignment = this.havenHubRepository.create({
      user_id: data.user_id,
      role_id: data.role_id,
      role,
    });

    return await this.havenHubRepository.save(roleAssignment);
  }
  async findAllHavenHubStaff(): Promise<HavenhubStaffUserRole[]> {
    return this.havenHubRepository.find({
      relations: ['role', 'user'],
      select: {
        id: true,
        user_id: true,
        role_id: true,
        created_at: true,
        role: { id: true, name: true, is_system_role: true },
        user: { id: true, first_name: true, last_name: true, email: true },
      },
    });
  }
  /**
   * Removes all HavenHub role assignments for a user — used when staff
   * offboarding requires revoking every system-level role they hold.
   */
  async removeAllStaffRoles(userId: string): Promise<void> {
    const assignments = await this.havenHubRepository.find({
      where: { user_id: userId },
    });
    if (!assignments.length) {
      throw new NotFoundException('No role assignments found for this user');
    }
    await this.havenHubRepository.remove(assignments);
  }
}
