import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { Recipe } from './recipe.entity';
import { CarbonationProfile } from 'src/profiles/entities/carbonation-profile.entity';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';

@Entity()
export class RecipeCarbonation {
  @PrimaryKeyUUID()
  id!: string;

  @ManyToOne(() => Recipe)
  recipe!: Recipe;

  @ManyToOne(() => CarbonationProfile)
  carbonation_profile!: CarbonationProfile;

  @Property({ nullable: true })
  amount_used!: string | null;

  @Property({ type: 'decimal', nullable: true })
  temperature!: number | null;

  @Property({ type: 'decimal', nullable: true })
  co2_volumes!: number | null;
}
