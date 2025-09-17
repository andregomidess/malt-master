import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { Recipe } from './recipe.entity';
import { Fermentable } from 'src/catalog/entities/fermentable.entity';
import { PrimaryKeyUUID } from 'src/database/common/helpers/mikro-orm/PrimaryKeyUUID';

@Entity()
export class RecipeFermentable {
  @PrimaryKeyUUID()
  id!: string;

  @ManyToOne(() => Recipe)
  recipe!: Recipe;

  @ManyToOne(() => Fermentable)
  fermentable!: Fermentable;

  @Property({ type: 'decimal', nullable: true })
  amount!: number | null;
}
