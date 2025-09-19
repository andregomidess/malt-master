import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { MashProfile } from './mash-profile.entity';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';

@Entity()
export class MashStep {
  @PrimaryKeyUUID()
  id!: string;

  @ManyToOne(() => MashProfile)
  mash_profile!: MashProfile;

  @Property()
  stepOrder!: number;

  @Property({ type: 'decimal' })
  temperature!: number;

  @Property()
  duration!: number;

  @Property({ nullable: true })
  description!: string | null;
}
