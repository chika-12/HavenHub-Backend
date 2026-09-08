import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolePermissionEntity } from './entity/rolePermissions.entity';
import { RolePermissionDto } from './dto/rolePermissions.dto';
import { PermissionsService } from 'src/permissions/permissions.service';
import { RoleService } from 'src/role/role.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RolePermissionsService {
  constructor(
    @InjectRepository(RolePermissionEntity)
    private readonly rolePermissionsRepository: Repository<RolePermissionEntity>,
    private readonly roleService: RoleService,
    private readonly usersService: UsersService,
    private readonly permissionService: PermissionsService,
  ) {}
  async create(
    data: RolePermissionDto,
    userId: string,
  ): Promise<RolePermissionEntity> {
    const roleCheck = await this.roleService.findOne(data.roleId);

    if (!roleCheck) {
      throw new NotFoundException('Role does not exist');
    }
    const permCheck = await this.permissionService.findOnePermission(
      data.permissionId,
    );
    if (!permCheck) {
      throw new NotFoundException('Permission does not exist');
    }
    const creator = await this.findUser(userId);
    const rolePermissionAssigned = this.rolePermissionsRepository.create({
      role: roleCheck,
      permission: permCheck,
      createdBy: creator,
    });
    return this.rolePermissionsRepository.save(rolePermissionAssigned);
  }
  async findOne(rolePerm: string): Promise<RolePermissionEntity> {
    const entity = await this.rolePermissionsRepository.findOne({
      where: { id: rolePerm },
      relations: ['role', 'permission'],
    });
    if (!entity) {
      throw new NotFoundException('Role permission not found');
    }
    return entity;
  }
  async update(
    rolePerm: string,
    data: Partial<RolePermissionDto>,
    userId: string,
  ): Promise<RolePermissionEntity> {
    const rolePermission = await this.findOne(rolePerm);

    if (data.roleId) {
      const role = await this.roleService.findOne(data.roleId);
      if (!role) {
        throw new NotFoundException('Role does not exist');
      }
      rolePermission.role = role;
    }

    if (data.permissionId) {
      const permission = await this.permissionService.findOnePermission(
        data.permissionId,
      );
      if (!permission) {
        throw new NotFoundException('Permission does not exist');
      }
      rolePermission.permission = permission;
    }
    const user = await this.findUser(userId);
    rolePermission.updatedBy = user;
    return this.rolePermissionsRepository.save(rolePermission);
  }

  async deactivateRolePermission(
    rolePerm: string,
    userId: string,
  ): Promise<{ status: string; message: string }> {
    const rolePermission = await this.findOne(rolePerm);
    const user = await this.findUser(userId);
    rolePermission.isActive = false;
    rolePermission.updatedBy = user;
    await this.rolePermissionsRepository.save(rolePermission);
    return {
      status: 'Success',
      message: 'Role permission deactivated',
    };
  }
  async reactivateRolePermission(
    rolePerm: string,
    userId: string,
  ): Promise<{ status: string; message: string }> {
    const findPerm = await this.findOne(rolePerm);
    const user = await this.findUser(userId);
    findPerm.isActive = true;
    findPerm.updatedBy = user;
    await this.rolePermissionsRepository.save(findPerm);
    return {
      status: 'Success',
      message: 'Role permission reactivated',
    };
  }
  async findUser(userId: string) {
    const user = await this.usersService.findUserById(userId);
    if (!user) {
      throw new NotFoundException('Unknown user');
    }
    return user;
  }
}
