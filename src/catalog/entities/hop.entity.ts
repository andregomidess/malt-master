import {
  Entity,
  Property,
  ManyToOne,
  Enum,
  OptionalProps,
} from '@mikro-orm/core';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';
import { PropertyCreatedAt } from 'src/database/common/helpers/PropertyCreatedAt';
import { PropertyDeletedAt } from 'src/database/common/helpers/PropertyDeletedAt';
import { PropertyUpdatedAt } from 'src/database/common/helpers/PropertyUpdatedAt';
import { User } from 'src/users/entities/user.entity';

export enum HopForm {
  PELLET = 'pellet',
  LEAF = 'leaf',
  CRYO = 'cryo',
  EXTRACT = 'extract',
}

export enum HopUse {
  BITTERING = 'bittering',
  AROMA = 'aroma',
  DRY_HOPPING = 'dry_hopping',
  DUAL_PURPOSE = 'dual_purpose',
}

@Entity()
export class Hop {
  @PrimaryKeyUUID()
  id!: string;

  @ManyToOne(() => User, { nullable: true })
  user!: User;

  @Property({ unique: true })
  name!: string;

  @Property({ type: 'decimal', precision: 5, scale: 2 })
  alphaAcids!: number;

  @Property({ type: 'decimal', precision: 5, scale: 2 })
  betaAcids!: number;

  @Property({ type: 'decimal', nullable: true, precision: 5, scale: 2 })
  cohumulone!: number | null;

  @Property({ type: 'decimal', nullable: true, precision: 4, scale: 2 })
  totalOils!: number | null;

  @Enum(() => HopForm)
  form!: HopForm;

  @Property({ type: 'json' })
  uses!: HopUse[];

  @Property({ type: 'text', nullable: true })
  aromaFlavor!: string | null;

  @Property({ nullable: true, type: 'smallint' })
  harvestYear!: number | null;

  @Property({ nullable: true })
  storageCondition!: string | null;

  @Property({ type: 'decimal', nullable: true, precision: 3, scale: 2 })
  hsi!: number | null;

  @Property({ type: 'decimal', nullable: true, precision: 7, scale: 2 })
  costPerKilogram!: number | null;

  @Property({ type: 'text', nullable: true })
  notes!: string | null;

  @Property({ nullable: true })
  origin!: string | null;

  @Property({ nullable: true })
  supplier!: string | null;

  @PropertyCreatedAt()
  createdAt!: Date;

  @PropertyUpdatedAt()
  updatedAt!: Date | null;

  @PropertyDeletedAt()
  deletedAt!: Date | null;

  public readonly [OptionalProps]!: 'updatedAt' | 'deletedAt';
}
