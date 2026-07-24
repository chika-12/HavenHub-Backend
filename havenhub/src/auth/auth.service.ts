import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
//import { InjectRepository } from '@nestjs/typeorm';
//import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { User } from 'src/users/entities/users.entities';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async registerUser(user: CreateUserDto): Promise<User> {
    const { password, ...userData } = user;
    const passwordHash = await this.harshPassword(password);

    return this.userService.createUser({
      ...userData,
      password: passwordHash,
    });
  }
  async login(
    loginData: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userService.findUserByEmail(loginData.email);
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
    const token = this.generateTokens(user.id, user.email);
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

  generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
}
