import { Entity, Property, OneToMany, Collection, Enum } from '@mikro-orm/core';
import { MashStep } from './mash-step.entity';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';

export enum MashProfileType {
  INFUSION = 'infusion',
  DECOCTION = 'decoction',
  STEP_MASH = 'step_mash',
}

@Entity()
export class MashProfile {
  @PrimaryKeyUUID()
  id!: string;

  @Property()
  name!: string;

  @Enum(() => MashProfileType)
  type!: MashProfileType;

  @Property({ type: 'decimal', nullable: true })
  estimatedEfficiency!: number | null;

  @Property({ type: 'text', nullable: true })
  observations!: string | null;

  @OneToMany(() => MashStep, (mashStep) => mashStep.mash_profile)
  steps = new Collection<MashStep>(this);
}
