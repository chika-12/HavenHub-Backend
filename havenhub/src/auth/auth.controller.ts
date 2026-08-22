/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { LoginDto } from './dto/login.dto';
import { ResendVerificationDto } from './dto/resendEmailVerification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() userdto: CreateUserDto) {
    return this.authService.registerUser(userdto);
  }
  @Post('login')
  async login(@Body() loginData: LoginDto) {
    return this.authService.login(loginData);
  }
  @Post('refreshToken')
  async refreshToken(@Body('refreshToken') token: string) {
    return this.authService.refreshToken(token);
  }
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }
  @Post('reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    console.log(newPassword);
    return this.authService.resetPassword(token, newPassword);
  }
  @UseGuards(JwtAuthGuard)
  @Post('change-password/:id')
  async changePassword(
    @Param('id') userId: string,
    @Body('currentPassword') currentPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.changePassword(
      userId,
      currentPassword,
      newPassword,
    );
  }
  @Post('logout/:id')
  async logout(@Param('id') userId: string) {
    return this.authService.logout(userId);
  }
  @Post('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }
  @Post('resend-verification')
  resendVerification(
    @Body() dto: ResendVerificationDto,
  ): Promise<{ status: string; message: string }> {
    return this.authService.resendVerificationEmail(dto.email);
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile/me')
  async userProfile(@Request() req: { user: { sub: string } }) {
    console.log('from the console', req.user.sub);
    return this.authService.getUserById(req.user.sub);
  }
}
