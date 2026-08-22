import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, AccountStatus } from './entities/users.entities';
import { CreateUserDto } from './dto/createUser.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private eventEmitter: EventEmitter2,
  ) {}

  async createUser(user: CreateUserDto): Promise<User> {
    const existingdata = await this.userRepository.findOne({
      where: [{ email: user.email }, { phone_number: user.phone_number }],
    });
    if (existingdata) {
      throw new ConflictException('User already exist');
    }
    const { password: password_hash, ...userData } = user;
    const data = this.userRepository.create({ password_hash, ...userData });

    return await this.userRepository.save(data);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'first_name',
        'last_name',
        'email',
        'phone_number',
        'profile_photo',
        'date_of_birth',
        'gender',
        'is_email_verified',
        'is_phone_verified',
        'account_status',
        'last_login',
        'created_at',
        'updated_at',
      ],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findUserById(userId: string): Promise<User | null> {
    if (!userId) {
      throw new NotFoundException('User not found');
    }
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: [
        'id',
        'first_name',
        'last_name',
        'email',
        'phone_number',
        'profile_photo',
        'date_of_birth',
        'gender',
        'is_email_verified',
        'is_phone_verified',
        'account_status',
        'last_login',
        'created_at',
        'updated_at',
      ],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(id: string, user: Partial<CreateUserDto>): Promise<User> {
    const existingUser = await this.userRepository.findOne({ where: { id } });
    if (!existingUser) {
      throw new ConflictException('User not found');
    }

    const updatedUser = this.userRepository.merge(existingUser, user);
    return await this.userRepository.save(updatedUser);
  }

  async updateRefreshToken(id: string, hashedToken: string | null) {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    user.refreshToken = hashedToken;
    return await this.userRepository.save(user);
  }
  async updateEmailVerificationToken(
    id: string,
    hashedToken: string | null,
    expiresIn: Date | null,
  ) {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    user.emailVerificationString = hashedToken;
    user.emailVerificationExpires = expiresIn;
    return await this.userRepository.save(user);
  }
  async updateIsVerifired(id: string, value: string) {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (value === 'email') {
      user.is_email_verified = true;
    } else if (value === 'phone') {
      user.is_phone_verified = true;
    }
    await this.userRepository.save(user);
  }

  async updateLoggingTime(id: string): Promise<void> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.last_login = new Date();
    await this.userRepository.save(user);
  }
  async setResetPasswordToken(
    id: string,
    hashedToken: string | null,
    expiresIn: Date | null,
  ) {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.resetPasswordToken = hashedToken;
    user.resetPasswordTokenExpires = expiresIn;
    return await this.userRepository.save(user);
  }
  async findUserByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }
  async findByResetToken(resetToken: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { resetPasswordToken: resetToken },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  verify_account_status(data: User) {
    if (data.account_status === AccountStatus.DEACTIVATED) {
      throw new UnauthorizedException('This account has been deactivated');
    }
  }
  async updatePassword(
    userId: string,
    passwordStr: string,
  ): Promise<{ status: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    try {
      user.password_hash = passwordStr;
      await this.userRepository.save(user);
    } catch {
      throw new UnauthorizedException('Password update failed');
    }
    return {
      status: 'Password updated successfully',
    };
  }

  async deleteUser(id: string): Promise<void> {
    const existingUser = await this.userRepository.findOne({ where: { id } });
    if (!existingUser) {
      throw new ConflictException('User not found');
    }
    await this.userRepository.remove(existingUser);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }
  async deactivateUser(userId: string, adminId: string): Promise<User> {
    const user = await this.findUserById(userId);
    const admin = await this.findUserById(adminId);
    if (!user) throw new NotFoundException('User not found');

    user.account_status = AccountStatus.DEACTIVATED;
    user.updated_by = admin?.id ?? adminId;
    await this.userRepository.save(user);

    this.eventEmitter.emit('user.deactivated', { userId });
    return user;
  }
}
