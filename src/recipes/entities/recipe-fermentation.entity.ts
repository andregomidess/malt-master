import {
  Entity,
  Property,
  ManyToOne,
  OneToOne,
  Cascade,
} from '@mikro-orm/core';
import { Recipe } from './recipe.entity';
import { FermentationProfile } from 'src/profiles/entities/fermentation-profile.entity';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';

@Entity()
export class RecipeFermentation {
  @PrimaryKeyUUID()
  id!: string;

  @OneToOne(() => Recipe, { owner: true, cascade: [Cascade.REMOVE] })
  recipe!: Recipe;

  @ManyToOne(() => FermentationProfile)
  fermentationProfile!: FermentationProfile;

  @Property({ type: 'decimal', nullable: true })
  actualAttenuation!: number | null;

  @Property({ type: 'decimal', nullable: true })
  finalAbv!: number | null;

  @Property({ type: 'text', nullable: true })
  observations!: string | null;
}
