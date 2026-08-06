import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entity/permissions.entity';
import { CreatePermissionDto } from './dto/permsion.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}
  async createPermission(
    permissionData: CreatePermissionDto,
  ): Promise<Permission> {
    const permissionCheck = await this.permissionRepository.findOne({
      where: { permission_name: permissionData.permission_name },
    });
    if (permissionCheck) {
      throw new ConflictException('Ths permssion exist');
    }
    const permission = this.permissionRepository.create({
      permission_name: permissionData.permission_name,
      description: permissionData.description,
      scope: permissionData.scope,
    });
    const saved = await this.permissionRepository.save(permission);
    return saved;
  }
  async updatePermssion(
    updatedPermission: Partial<CreatePermissionDto>,
    id: string,
  ): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
    });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    if (
      updatedPermission.permission_name &&
      updatedPermission.permission_name !== permission.permission_name
    ) {
      const conflict = await this.permissionRepository.findOne({
        where: { permission_name: updatedPermission.permission_name },
      });
      if (conflict) {
        throw new ConflictException('This permission already exists');
      }
    }

    const updated = this.permissionRepository.merge(
      permission,
      updatedPermission,
    );
    return await this.permissionRepository.save(updated);
  }
  async findOnePermission(id: string): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id: id },
    });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    return permission;
  }
  async findAllPermission(): Promise<Permission[]> {
    const permissions = await this.permissionRepository.find();
    if (!permissions || permissions.length === 0) {
      throw new NotFoundException('No permissions found yet');
    }
    return permissions;
  }
  async removePermissions(
    id: string,
  ): Promise<{ status: string; message: string }> {
    const deletePermission = await this.permissionRepository.findOne({
      where: { id: id },
    });
    if (!deletePermission) {
      throw new NotFoundException('Permission not found');
    }
    await this.permissionRepository.delete(id);
    return { status: 'success', message: 'Permission deleted successfully' };
  }
}
