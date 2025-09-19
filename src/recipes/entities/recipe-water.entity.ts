import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { Recipe } from './recipe.entity';
import { WaterProfile } from 'src/catalog/entities/water-profile.entity';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';

@Entity()
export class RecipeWater {
  @PrimaryKeyUUID()
  id!: string;

  @ManyToOne(() => Recipe)
  recipe!: Recipe;

  @ManyToOne(() => WaterProfile)
  water_profile!: WaterProfile;

  @Property({ type: 'decimal', nullable: true })
  volume!: number | null;

  @Property({ type: 'text', nullable: true })
  adjustments!: string | null;
}
