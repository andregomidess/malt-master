import { Entity, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { MashProfile } from './mash-profile.entity';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';

export enum MashStepType {
  INFUSION = 'infusion',
  TEMPERATURE = 'temperature',
  DECOCTION = 'decoction',
}

@Entity()
export class MashStep {
  @PrimaryKeyUUID()
  id!: string;

  @ManyToOne(() => MashProfile)
  mashProfile!: MashProfile;

  @Property()
  stepOrder!: number;

  @Property()
  name!: string;

  @Enum(() => MashStepType)
  stepType!: MashStepType;

  @Property({ type: 'decimal' })
  temperature!: number;

  @Property()
  duration!: number;

  @Property({ type: 'decimal', nullable: true })
  infusionAmount!: number | null;

  @Property({ type: 'decimal', nullable: true })
  infusionTemp!: number | null;

  @Property({ type: 'decimal', nullable: true })
  decoctionAmount!: number | null;

  @Property({ nullable: true })
  rampTime!: number | null;

  @Property({ nullable: true })
  description!: string | null;
}
