import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET, // or however you're configuring it
      signOptions: { expiresIn: '15m' },
    }),
    UsersModule,
  ],
})
export class AuthModule {}
