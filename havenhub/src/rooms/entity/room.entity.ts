import { Hotel } from 'src/hotel/entities/hotel.entity';
import { User } from 'src/users/entities/users.entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
  JoinColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

@Entity()
@Index(['hotel', 'name'], { unique: true })
export class RoomType {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Hotel, { nullable: false })
  @JoinColumn({ name: 'hotel_id' })
  hotel!: Hotel;

  @Column({ type: 'varchar', nullable: false })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  basePrice!: string;

  @Column({ type: 'int', nullable: false })
  totalUnits!: number;

  @Column({ type: 'int', nullable: false })
  maxOccupancy!: number;

  @CreateDateColumn()
  createdAt!: Date;
  @UpdateDateColumn()
  updatedAt?: Date;
  @DeleteDateColumn({ nullable: true })
  deletedAt!: Date | null;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  createdBy!: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  updatedBy?: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'deleted_by' })
  deletedBy?: User;
}
