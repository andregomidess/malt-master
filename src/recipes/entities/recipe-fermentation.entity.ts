import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { Recipe } from './recipe.entity';
import { FermentationProfile } from 'src/profiles/entities/fermentation-profile.entity';
import { PrimaryKeyUUID } from 'src/database/common/helpers/mikro-orm/PrimaryKeyUUID';

@Entity()
export class RecipeFermentation {
  @PrimaryKeyUUID()
  id!: string;

  @ManyToOne(() => Recipe)
  recipe!: Recipe;

  @ManyToOne(() => FermentationProfile)
  fermentation_profile!: FermentationProfile;

  @Property({ type: 'decimal', nullable: true })
  actual_attenuation!: number | null;

  @Property({ type: 'decimal', nullable: true })
  final_abv!: number | null;

  @Property({ type: 'text', nullable: true })
  observations!: string | null;
}
