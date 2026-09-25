import { Hotel } from 'src/hotel/entities/hotel.entity';
import { User } from 'src/users/entities/users.entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'boolean', default: false })
  is_system_role!: boolean;

  @ManyToOne(() => Hotel, { nullable: true })
  @JoinColumn({ name: 'hotel_id' })
  hotel?: Hotel;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy!: User;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
