import { Injectable } from '@nestjs/common';
import { RoleService } from './role.service';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class RoleEventListener {
  constructor(private roleService: RoleService) {}

  @OnEvent('user.deactivated')
  async handleUserDeactivated(payload: { userId: string }) {
    await this.roleService.removeAllStaffRoles(payload.userId).catch(() => {});
  }
}
