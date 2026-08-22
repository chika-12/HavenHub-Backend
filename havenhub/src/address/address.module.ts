import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
@Module({
  providers: [AddressService],
  exports: [AddressService],
  imports: [TypeOrmModule.forFeature([Address]), UsersModule],
})
export class AddressModule {}
