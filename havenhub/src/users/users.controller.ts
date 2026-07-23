/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('create')
  async createUser(@Body() userdto: CreateUserDto) {
    return this.userService.createUser(userdto);
  }
  @Get('get/:email')
  async getUserByEmail(@Param('email') email: string) {
    return this.userService.findUserByEmail(email);
  }
  @Get('get/id/:id')
  async getUserById(@Param('id') id: string) {
    return this.userService.findUserById(id);
  }
  @Get('get/all')
  async getAllUsers() {
    return this.userService.getAllUsers();
  }
  @Put('update/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() userdto: Partial<CreateUserDto>,
  ) {
    return this.userService.updateUser(id, userdto);
  }
  @Delete('delete/:id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
  @Get('health')
  healthCheck() {
    return { status: 'ok' };
  }
}
