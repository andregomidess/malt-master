import { Entity, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { Recipe } from './recipe.entity';
import { Fermentable } from 'src/catalog/entities/fermentable.entity';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';

export enum FermentableUsageType {
  MASH = 'mash',
  STEEP = 'steep',
  BOIL = 'boil',
  LATE_BOIL = 'late_boil',
  FERMENTATION = 'fermentation',
}

@Entity()
export class RecipeFermentable {
  @PrimaryKeyUUID()
  id!: string;

  @ManyToOne(() => Recipe)
  recipe!: Recipe;

  @ManyToOne(() => Fermentable)
  fermentable!: Fermentable;

  @Property({ type: 'double', nullable: true })
  amount!: number | null;

  @Enum({ type: () => FermentableUsageType, nullable: true })
  usageType!: FermentableUsageType | null;
}
