import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from './email/email.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RoleModule } from './role/role.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AddressModule } from './address/address.module';
import { HotelModule } from './hotel/hotel.module';
import { OrganizationModule } from './organization/organization.module';
import { RolePermissionsModule } from './role-permissions/role-permissions.module';
import { HotelStaffModule } from './hotel-staff/hotel-staff.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        ssl: {
          rejectUnauthorized: false,
        },
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    AuthModule,
    UsersModule,
    EmailModule,
    PermissionsModule,
    RoleModule,
    AddressModule,
    HotelModule,
    OrganizationModule,
    RolePermissionsModule,
    HotelStaffModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
