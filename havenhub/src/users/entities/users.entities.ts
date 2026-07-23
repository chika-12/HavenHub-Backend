// src/users/entities/user.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DEACTIVATED = 'DEACTIVATED',
  BANNED = 'BANNED',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  first_name!: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  last_name!: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email!: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  phone_number!: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Exclude()
  @Column({ type: 'varchar', nullable: false })
  password_hash!: string;

  @Column({ type: 'varchar', nullable: true })
  profile_photo!: string;

  @Column({ type: 'date', nullable: true })
  date_of_birth!: Date;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender!: Gender;

  @Column({ type: 'boolean', default: false })
  is_email_verified!: boolean;

  @Column({ type: 'boolean', default: false })
  is_phone_verified!: boolean;

  @Column({
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.ACTIVE,
  })
  account_status!: AccountStatus;

  @Column({ type: 'timestamp', nullable: true })
  last_login!: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at!: Date;
}
