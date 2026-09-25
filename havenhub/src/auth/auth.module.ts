import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { EmailModule } from '../email/email.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HavenhubStaffUserRole } from '../role/entities/havenhubRole.entity';
import { Role } from 'src/role/entities/role.entity';
import { RolePermissionsModule } from 'src/role-permissions/role-permissions.module';
import { HotelStaffModule } from 'src/hotel-staff/hotel-staff.module';
import { RoleModule } from 'src/role/role.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard],
  imports: [
    //TypeOrmModule.forFeature([HavenhubStaffUserRole, Role]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET, // or however you're configuring it
      signOptions: { expiresIn: '15m' },
    }),
    UsersModule,
    EmailModule,
    RoleModule,
    RolePermissionsModule,
    HotelStaffModule,
  ],
  exports: [AuthService, RolesGuard, JwtStrategy],
})
export class AuthModule {}
