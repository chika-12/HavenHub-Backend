import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
//import { InjectRepository } from '@nestjs/typeorm';
//import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes, timingSafeEqual } from 'crypto';
import { EmailService } from 'src/email/email.service';
import { ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';
import { User } from 'src/users/entities/users.entities';

/* Todo 
login()
signup()
validateUser()
validateJwtUser()
generateAccessToken()
generateRefreshToken()
refreshTokens()
logout()
logoutAllDevices()
forgotPassword()
resetPassword()
changePassword()
sendVerificationEmail()
verifyEmail()
resendVerificationEmail()
*/

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}
  async registerUser(
    user: CreateUserDto,
  ): Promise<{ status: string; message: string; email: string }> {
    const { password, ...userData } = user;
    const passwordHash = await this.harshPassword(password);

    const regUser = await this.userService.createUser({
      ...userData,
      password: passwordHash,
    });
    const emailToken = this.generateEmailVerificationToken(
      regUser.id,
      regUser.email,
    );
    const hashedEmailToken = this.hashToken(emailToken);
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await this.userService.updateEmailVerificationToken(
      regUser.id,
      hashedEmailToken,
      expires,
    );
    await this.emailService.sendVerificationEmail(regUser.email, emailToken);
    return {
      status: 'Success',
      message:
        'Registration successful. Please check your email to verify your account.',
      email: regUser.email,
    };
  }
  async verifyEmail(
    emailToken: string,
  ): Promise<{ status: string; message: string }> {
    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
        type: string;
      }>(emailToken, {
        secret: this.configService.getOrThrow<string>('JWT_EMAIL_SECRET'),
      });
      const user = await this.userService.findUserById(payload.sub);
      if (
        !user ||
        !user.emailVerificationString ||
        !user.emailVerificationExpires ||
        user.emailVerificationExpires < new Date()
      ) {
        throw new NotFoundException('Invalid token or user not found');
      }
      if (payload.type !== 'email-verification') {
        throw new UnauthorizedException('Invalid token');
      }
      if (!this.compareToken(emailToken, user.emailVerificationString)) {
        throw new UnauthorizedException('Invalid verification token');
      }
      if (user.is_email_verified) {
        return {
          status: 'Success',
          message: 'Email is already verified.',
        };
      }
      await this.userService.updateIsVerifired(user.id, 'email');
      await this.userService.updateEmailVerificationToken(user.id, null, null);
    } catch {
      throw new UnauthorizedException('Invalid or expired verification token');
    }
    return {
      status: 'Success',
      message: 'Email verified',
    };
  }

  async resendVerificationEmail(
    email: string,
  ): Promise<{ status: string; message: string }> {
    const user = await this.userService.findUserByEmail(email);

    // Don't reveal whether the email exists
    if (!user) {
      return {
        status: 'Success',
        message:
          'If an account with that email exists, a verification email has been sent.',
      };
    }

    if (user.is_email_verified) {
      return {
        status: 'Success',
        message: 'Email is already verified.',
      };
    }

    const emailToken = this.generateEmailVerificationToken(user.id, user.email);

    const hashedToken = this.hashToken(emailToken);

    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.userService.updateEmailVerificationToken(
      user.id,
      hashedToken,
      expires,
    );

    await this.emailService.sendVerificationEmail(user.email, emailToken);

    return {
      status: 'Success',
      message:
        'If an account with that email exists, a verification email has been sent.',
    };
  }
  async login(
    loginData: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userService.findUserByEmailWithPassword(
      loginData.email,
    );
    if (!user) {
      throw new NotFoundException('Invalid Email or Password');
    }
    const passCheck = await this.comparePassword(
      loginData.password,
      user.password_hash,
    );
    if (!passCheck) {
      throw new UnauthorizedException('Invalid Email or Password');
    }
    this.userService.verify_account_status(user);
    if (!user.is_email_verified) {
      throw new UnauthorizedException(
        'Please verify your email before logging in.',
      );
    }
    const token = this.generateTokens(user.id, user.email);
    const hashedToken = this.hashToken(token.refreshToken);
    await this.userService.updateRefreshToken(user.id, hashedToken);
    await this.userService.updateLoggingTime(user.id);
    const { accessToken, refreshToken } = token;
    return { accessToken, refreshToken };
  }

  async harshPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 12);
    return hashedPassword;
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  }
  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
  private compareToken(token: string, storedHash: string): boolean {
    const incomingHash = this.hashToken(token);
    if (incomingHash.length !== storedHash.length) return false;
    return timingSafeEqual(Buffer.from(incomingHash), Buffer.from(storedHash));
  }

  generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
  async refreshToken(userRefreshToken: string) {
    const payload = await this.jwtService.verifyAsync<{
      sub: string;
      email: string;
    }>(userRefreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });
    if (!payload) {
      throw new UnauthorizedException('Invalid Token');
    }
    const user = await this.userService.findUserById(payload.sub);
    if (!user) {
      throw new NotFoundException('Invalid Token');
    }
    const userDBToken = user.refreshToken;
    if (!userDBToken) {
      throw new UnauthorizedException('Invalid Token');
    }
    const tokenCheck = this.compareToken(userRefreshToken, userDBToken);

    if (!tokenCheck) {
      throw new UnauthorizedException('Invalid Token');
    }
    const tokens = this.generateTokens(user.id, user.email);
    const hashedToken = this.hashToken(tokens.refreshToken);
    await this.userService.updateRefreshToken(user.id, hashedToken);

    const { accessToken, refreshToken } = tokens;
    return { accessToken, refreshToken };
  }
  private generateEmailVerificationToken(userId: string, email: string) {
    return this.jwtService.sign(
      {
        sub: userId,
        email,
        type: 'email-verification',
      },
      {
        secret: this.configService.getOrThrow<string>('JWT_EMAIL_SECRET'),
        expiresIn: this.configService.getOrThrow<StringValue>(
          'JWT_EMAIL_EXPIRES_IN',
        ),
      },
    );
  }

  async logout(userId: string): Promise<{ status: string }> {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    try {
      await this.userService.updateRefreshToken(user.id, null);
    } catch {
      throw new UnauthorizedException('Logout failed');
    }
    return {
      status: 'Logout Successfull',
    };
  }
  async forgotPassword(
    email: string,
  ): Promise<{ status: string; message: string }> {
    const user = await this.userService.findUserByEmail(email);
    if (user) {
      const token = randomBytes(32).toString('hex');
      const expiresIn = new Date(Date.now() + 15 * 60 * 1000);
      const hashedToken = this.hashToken(token);
      await this.userService.setResetPasswordToken(
        user.id,
        hashedToken,
        expiresIn,
      );
      await this.emailService.sendPasswordResetEmail(user.email, token);
    }
    return {
      status: 'Success',
      message: 'Check your email',
    };
  }
  async resetPassword(resetToken: string, newPassword: string): Promise<void> {
    const hashedToken = this.hashToken(resetToken);
    const user = await this.userService.findByResetToken(hashedToken);
    if (
      !user ||
      !user.resetPasswordToken ||
      !user.resetPasswordTokenExpires ||
      user.resetPasswordTokenExpires < new Date()
    ) {
      throw new NotFoundException('Invalid or expired token');
    }
    const hashedPassword = await this.harshPassword(newPassword);
    await this.userService.updatePassword(user.id, hashedPassword);
    await this.userService.setResetPasswordToken(user.id, null, null);
    await this.userService.updateRefreshToken(user.id, null);
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ status: string; message: string }> {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    const passCheck = await this.comparePassword(
      currentPassword,
      user.password_hash,
    );
    if (!passCheck) {
      throw new UnauthorizedException('Current password is incorrect');
    }
    const passwordHash = await this.harshPassword(newPassword);
    await this.userService.updatePassword(user.id, passwordHash);

    await this.userService.updateRefreshToken(user.id, null);
    return {
      status: 'Successful',
      message: 'Please Loggin Again',
    };
  }
  async getUserById(id: string): Promise<User> {
    const user = await this.userService.findUserById(id);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    return user;
  }
  async deactivateUser(
    userId: string,
    adminId: string,
  ): Promise<{ status: string; message: string }> {
    const deactivate = await this.userService.deactivateUser(userId, adminId);
    if (!deactivate) {
      throw new BadRequestException('Deactivation failed');
    }
    return {
      status: 'Successfull',
      message: 'User deactivated and all permisions striped off',
    };
  }
}
