import { Entity, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';
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

  @Property({ type: 'decimal', nullable: true })
  alphaAcids!: number | null;

  @Property({ type: 'decimal', nullable: true })
  betaAcids!: number | null;

  @Property({ type: 'decimal', nullable: true })
  cohumulone!: number | null;

  @Property({ type: 'decimal', nullable: true })
  totalOils!: number | null;

  @Enum(() => HopForm)
  type!: HopForm;

  @Enum(() => HopUse)
  primaryUse!: HopUse;

  @Property({ type: 'text', nullable: true })
  aromaFlavor!: string | null;

  @Property({ nullable: true })
  harvest_year!: string | null;

  @Property({ nullable: true })
  storageCondition!: string | null;

  @Property({ type: 'decimal', nullable: true })
  hsi!: number | null;

  @Property({ type: 'decimal', nullable: true })
  costPerGram!: number | null;

  @Property({ type: 'text', nullable: true })
  observations!: string | null;
}
