import { Entity, ManyToOne, OptionalProps, Property } from '@mikro-orm/core';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';
import { PropertyCreatedAt } from 'src/database/common/helpers/PropertyCreatedAt';
import { PropertyDeletedAt } from 'src/database/common/helpers/PropertyDeletedAt';
import { PropertyUpdatedAt } from 'src/database/common/helpers/PropertyUpdatedAt';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class WaterProfile {
  @PrimaryKeyUUID()
  id!: string;

  @Property({ unique: true })
  name!: string;

  @ManyToOne(() => User, { nullable: true })
  user!: User | null;

  @Property({ nullable: true })
  origin!: string | null;

  @Property({ type: 'decimal', nullable: true, precision: 5, scale: 2 })
  ca!: number | null;

  @Property({ type: 'decimal', nullable: true, precision: 5, scale: 2 })
  mg!: number | null;

  @Property({ type: 'decimal', nullable: true, precision: 5, scale: 2 })
  na!: number | null;

  @Property({ type: 'decimal', nullable: true, precision: 5, scale: 2 })
  so4!: number | null;

  @Property({ type: 'decimal', nullable: true, precision: 5, scale: 2 })
  cl!: number | null;

  @Property({ type: 'decimal', nullable: true, precision: 5, scale: 2 })
  hco3!: number | null;

  @Property({ type: 'decimal', nullable: true, precision: 3, scale: 2 })
  ph!: number | null;

  @Property({ nullable: true })
  recommendedStyle!: string | null;

  @Property({ type: 'text', nullable: true })
  notes!: string | null;

  @PropertyCreatedAt()
  createdAt!: Date;

  @PropertyUpdatedAt()
  updatedAt!: Date | null;

  @PropertyDeletedAt()
  deletedAt!: Date | null;

  public readonly [OptionalProps]!: 'updatedAt' | 'deletedAt';
}
