import {
  Entity,
  Property,
  OneToMany,
  Collection,
  Enum,
  OptionalProps,
  ManyToOne,
} from '@mikro-orm/core';
import { MashStep } from './mash-step.entity';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';
import { PropertyCreatedAt } from 'src/database/common/helpers/PropertyCreatedAt';
import { PropertyUpdatedAt } from 'src/database/common/helpers/PropertyUpdatedAt';
import { User } from 'src/users/entities/user.entity';

export enum MashProfileType {
  INFUSION = 'infusion',
  DECOCTION = 'decoction',
  STEP_MASH = 'step_mash',
  BIAB = 'biab',
}

@Entity()
export class MashProfile {
  @PrimaryKeyUUID()
  id!: string;

  @Property()
  name!: string;

  @ManyToOne(() => User, { nullable: true })
  user!: User | null;

  @Enum(() => MashProfileType)
  type!: MashProfileType;

  @OneToMany(() => MashStep, (mashStep) => mashStep.mashProfile, {
    orphanRemoval: true,
  })
  steps = new Collection<MashStep>(this);

  @Property({ type: 'decimal', nullable: true, precision: 5, scale: 2 })
  estimatedEfficiency!: number | null;

  @Property({ type: 'decimal', default: 20, precision: 5, scale: 2 })
  grainTemperature!: number;

  @Property({ type: 'decimal', default: 20, precision: 5, scale: 2 })
  tunTemperature!: number;

  @Property({ type: 'decimal', default: 78, precision: 5, scale: 2 })
  spargeTemperature!: number;

  @Property({ type: 'decimal', nullable: true, precision: 8, scale: 2 })
  tunWeight!: number | null;

  @Property({ type: 'decimal', default: 0.3, precision: 3, scale: 2 })
  tunSpecificHeat!: number;

  @Property({ type: 'decimal', default: 3.0, precision: 4, scale: 2 })
  mashThickness!: number;

  @Property({ type: 'text', nullable: true })
  observations!: string | null;

  @Property()
  isPublic: boolean = false;

  @PropertyCreatedAt()
  createdAt!: Date;

  @PropertyUpdatedAt()
  updatedAt!: Date;

  public readonly [OptionalProps]!: 'updatedAt' | 'createdAt';
}
