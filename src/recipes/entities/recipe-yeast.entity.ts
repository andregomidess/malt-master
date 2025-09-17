import { Entity, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { Recipe } from './recipe.entity';
import { Yeast } from 'src/catalog/entities/yeast.entity';
import { PrimaryKeyUUID } from 'src/database/common/helpers/mikro-orm/PrimaryKeyUUID';

export enum YeastStage {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  STARTER = 'starter',
}

@Entity()
export class RecipeYeast {
  @PrimaryKeyUUID()
  id!: string;

  @ManyToOne(() => Recipe)
  recipe!: Recipe;

  @ManyToOne(() => Yeast)
  yeast!: Yeast;

  @Property({ nullable: true })
  amount!: string | null;

  @Property({ nullable: true })
  pitching_rate!: string | null;

  @Enum(() => YeastStage)
  stage!: YeastStage;
}
