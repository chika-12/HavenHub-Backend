import { Hotel } from 'src/hotel/entities/hotel.entity';
import { Role } from 'src/role/entities/role.entity';
import { User } from 'src/users/entities/users.entities';
import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  DeleteDateColumn,
} from 'typeorm';
@Entity()
@Index(['user', 'role', 'hotel'], { unique: true })
export class HotelStaff {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role!: Role;

  @ManyToOne(() => Hotel)
  @JoinColumn({ name: 'hotel_id' })
  hotel!: Hotel;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  createdBy!: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by_id' })
  updatedBy!: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'deleted_by_id' })
  deletedBy?: User;

  @Column({ enum: ['active', 'suspended', 'deactivated'], default: 'active' })
  status!: string;

  @Column({ nullable: true })
  reasonForStatus?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
