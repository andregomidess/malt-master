import {
  Entity,
  Property,
  ManyToOne,
  Enum,
  OptionalProps,
  Unique,
} from '@mikro-orm/core';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';
import { PropertyCreatedAt } from 'src/database/common/helpers/PropertyCreatedAt';
import { PropertyDeletedAt } from 'src/database/common/helpers/PropertyDeletedAt';
import { PropertyUpdatedAt } from 'src/database/common/helpers/PropertyUpdatedAt';
import { User } from 'src/users/entities/user.entity';

export enum YeastType {
  ALE = 'ale',
  LAGER = 'lager',
  WILD = 'wild',
  BACTERIA = 'bacteria',
}

export enum YeastFlocculation {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum YeastFormat {
  DRY = 'dry',
  LIQUID = 'liquid',
  SLURRY = 'slurry',
}

@Entity()
@Unique({ properties: ['name', 'supplier'] })
export class Yeast {
  @PrimaryKeyUUID()
  id!: string;

  @ManyToOne(() => User, { nullable: true })
  user!: User | null;

  @Property()
  name!: string;

  @Enum(() => YeastType)
  type!: YeastType;

  @Property({ type: 'decimal', nullable: true, precision: 5, scale: 2 })
  attenuation!: number | null;

  @Enum(() => YeastFlocculation)
  flocculation!: YeastFlocculation;

  @Property({ type: 'decimal', nullable: true, precision: 5, scale: 2 })
  minTemp!: number | null;

  @Property({ type: 'decimal', nullable: true, precision: 5, scale: 2 })
  maxTemp!: number | null;

  @Enum(() => YeastFormat)
  format!: YeastFormat;

  @Property({ type: 'decimal', nullable: true, precision: 5, scale: 2 })
  alcoholTolerance!: number | null;

  @Property({ nullable: true })
  origin!: string | null;

  @Property({ nullable: true })
  supplier!: string | null;

  @Property({ type: 'date', nullable: true })
  packagingDate!: Date | null;

  @Property({ type: 'text', nullable: true })
  aromaFlavor!: string | null;

  @Property({ type: 'text', nullable: true })
  rehydrationNotes!: string | null;

  @Property({ type: 'text', nullable: true })
  starterNotes!: string | null;

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
