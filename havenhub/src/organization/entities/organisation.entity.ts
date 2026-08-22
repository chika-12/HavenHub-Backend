// organization.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from 'src/users/entities/users.entities';

@Entity('organizations')
@Index(['organisationRegNo'], { unique: true })
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  taxId!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  organisationRegNo!: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt!: Date | null;

  @ManyToOne(() => User)
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
