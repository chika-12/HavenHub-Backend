// hotel.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  //OneToMany,
} from 'typeorm';
import { Address } from 'src/address/entities/address.entity';
import { User } from 'src/users/entities/users.entities';
import { Organization } from 'src/organization/entities/organisation.entity';

export enum HotelStatus {
  PENDING = 'pending',
  REJECTED = 'rejected',
  UNDER_REVIEW = 'under_review',
  CLOSED = 'closed',
  ACTIVE = 'active',
}

@Entity('hotels')
export class Hotel {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name!: string;

  @ManyToOne(() => Address)
  @JoinColumn({ name: 'address_id' })
  address!: Address;

  @Column({ type: 'varchar', length: 100, nullable: false })
  phone!: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email!: string;

  @Column({
    type: 'enum',
    enum: HotelStatus,
    default: HotelStatus.PENDING,
    nullable: false,
  })
  status!: HotelStatus;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt!: Date | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'verified_by' })
  verifiedBy!: User | null;

  @Column({ type: 'text', nullable: true })
  rejectionReason!: string | null;

  @Column({ type: 'varchar', nullable: true })
  logoUrl!: string | null;

  @ManyToOne(() => Organization, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'organisation_id' })
  organisation!: Organization | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt!: Date | null;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt!: Date | null;

  @ManyToOne(() => User, {
    nullable: false,
  })
  @JoinColumn({ name: 'created_by' })
  createdBy!: User;

  @ManyToOne(() => User, {
    nullable: true,
  })
  @JoinColumn({ name: 'updated_by' })
  updatedBy!: User | null;

  @ManyToOne(() => User, {
    nullable: true,
  })
  @JoinColumn({ name: 'deleted_by' })
  deletedBy!: User | null;
}
