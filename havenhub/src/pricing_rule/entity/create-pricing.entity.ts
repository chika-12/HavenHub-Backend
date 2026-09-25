import { Hotel } from 'src/hotel/entities/hotel.entity';
import { User } from 'src/users/entities/users.entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
  Index,
} from 'typeorm';

export enum PricingRuleType {
  WEEKEND_BONUS = 'weekend_bonus',
  SEASONAL_DISCOUNT = 'seasonal_discount',
}

@Entity()
@Index(['hotel', 'ruleType'], { unique: true, where: '"deletedAt" IS NULL' })
export class PricingRule {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Hotel, { nullable: false })
  @JoinColumn({ name: 'hotel_id' })
  hotel!: Hotel;

  @Column({
    type: 'enum',
    enum: PricingRuleType,
    nullable: false,
  })
  ruleType!: PricingRuleType;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: false,
  })
  percentage!: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  startDate?: Date;

  @Column({
    type: 'date',
    nullable: true,
  })
  endDate?: Date;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive!: boolean;

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
