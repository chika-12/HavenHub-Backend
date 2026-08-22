import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/users.entities';
@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', nullable: false })
  country!: string;

  @Column({ type: 'varchar', nullable: false })
  state!: string;

  @Column({ type: 'varchar', nullable: false })
  city!: string;
  @Column({ type: 'varchar', nullable: false })
  street!: string;

  @Column({ type: 'varchar', nullable: true })
  postalCode!: string;

  @ManyToMany(() => User, {
    nullable: false,
  })
  @JoinColumn({ name: 'crated_by' })
  createdBy!: User;
  @ManyToMany(() => User, {
    nullable: true,
  })
  @JoinColumn({ name: 'updated_by' })
  updatedBy!: User | null;
  @ManyToMany(() => User, {
    nullable: true,
  })
  @JoinColumn({ name: 'deleted_by' })
  deletedBy!: User | null;
  @CreateDateColumn({
    name: 'created_at',
    type: 'time with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  cratedAt!: Date;
  @CreateDateColumn({
    name: 'updated_at',
    type: 'time with time zone',
    default: () => 'CURRENT_TIMESTAP',
  })
  updatedAt!: Date;
  @CreateDateColumn({
    name: 'deleted_at',
    type: 'time with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  deletedAt!: Date;
}
