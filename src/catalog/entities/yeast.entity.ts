import { Entity, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { PrimaryKeyUUID } from 'src/database/common/helpers/mikro-orm/PrimaryKeyUUID';
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
export class Yeast {
  @PrimaryKeyUUID()
  id!: string;

  @ManyToOne(() => User, { nullable: true })
  user!: User;

  @Property({ unique: true })
  name!: string;

  @Enum(() => YeastType)
  type!: YeastType;

  @Property({ type: 'decimal', nullable: true })
  attenuation!: number | null;

  @Enum(() => YeastFlocculation)
  flocculation!: YeastFlocculation;

  @Property({ type: 'decimal', nullable: true })
  minTemp!: number | null;

  @Property({ type: 'decimal', nullable: true })
  maxTemp!: number | null;

  @Enum(() => YeastFormat)
  format!: YeastFormat;

  @Property({ type: 'decimal', nullable: true })
  alcoholTolerance!: number | null;

  @Property({ nullable: true })
  origin!: string | null;

  @Property({ type: 'text', nullable: true })
  aromaFlavor!: string | null;

  @Property({ type: 'text', nullable: true })
  observations!: string | null;
}
