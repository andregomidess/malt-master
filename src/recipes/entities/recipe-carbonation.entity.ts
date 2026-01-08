import {
  Entity,
  Property,
  ManyToOne,
  OneToOne,
  Cascade,
} from '@mikro-orm/core';
import { Recipe } from './recipe.entity';
import { CarbonationProfile } from 'src/profiles/entities/carbonation-profile.entity';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';

@Entity()
export class RecipeCarbonation {
  @PrimaryKeyUUID()
  id!: string;

  @OneToOne(() => Recipe, { owner: true, cascade: [Cascade.REMOVE] })
  recipe!: Recipe;

  @ManyToOne(() => CarbonationProfile)
  carbonationProfile!: CarbonationProfile;

  @Property({ nullable: true })
  amountUsed!: string | null;

  @Property({ type: 'double', nullable: true })
  temperature!: number | null;

  @Property({ type: 'double', nullable: true })
  co2Volumes!: number | null;
}
