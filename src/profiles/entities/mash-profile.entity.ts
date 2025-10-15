import {
  Entity,
  Property,
  OneToMany,
  Collection,
  Enum,
  OptionalProps,
} from '@mikro-orm/core';
import { MashStep } from './mash-step.entity';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';
import { PropertyCreatedAt } from 'src/database/common/helpers/PropertyCreatedAt';
import { PropertyUpdatedAt } from 'src/database/common/helpers/PropertyUpdatedAt';

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

  @Enum(() => MashProfileType)
  type!: MashProfileType;

  @OneToMany(() => MashStep, (mashStep) => mashStep.mashProfile)
  steps = new Collection<MashStep>(this);

  @Property({ type: 'decimal', nullable: true })
  estimatedEfficiency!: number | null;

  @Property({ type: 'decimal', default: 20 })
  grainTemperature!: number;

  @Property({ type: 'decimal', default: 20 })
  tunTemperature!: number;

  @Property({ type: 'decimal', default: 78 })
  spargeTemperature!: number;

  @Property({ type: 'decimal', nullable: true })
  tunWeight!: number | null;

  @Property({ type: 'decimal', default: 0.3 })
  tunSpecificHeat!: number;

  @Property({ type: 'decimal', default: 3.0 })
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
