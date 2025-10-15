import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { FermentationProfile } from './fermentation-profile.entity';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';

@Entity()
export class FermentationStep {
  @PrimaryKeyUUID()
  id!: string;

  @ManyToOne(() => FermentationProfile)
  fermentationProfile!: FermentationProfile;

  @Property()
  stepOrder!: number;

  @Property()
  name!: string;

  @Property({ type: 'decimal' })
  temperature!: number;

  @Property()
  duration!: number;

  @Property({ type: 'decimal', nullable: true })
  targetGravity!: number | null;

  @Property({ type: 'decimal', nullable: true })
  pressureControl!: number | null;

  @Property({ default: false })
  isRamping!: boolean;

  @Property({ nullable: true })
  rampTime!: number | null;

  @Property({ type: 'decimal', nullable: true })
  rampToTemperature!: number | null;

  @Property({ nullable: true })
  description!: string | null;
}
