import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { FermentationProfile } from './fermentation-profile.entity';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';

@Entity()
export class FermentationStep {
  @PrimaryKeyUUID()
  id!: string;

  @ManyToOne(() => FermentationProfile)
  fermentation_profile!: FermentationProfile;

  @Property()
  stepOrder!: number;

  @Property({ type: 'decimal' })
  temperature!: number;

  @Property()
  duration!: number;

  @Property({ nullable: true })
  description!: string | null;
}
