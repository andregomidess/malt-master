import { Entity, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { Recipe } from './recipe.entity';
import { Hop } from 'src/catalog/entities/hop.entity';
import { PrimaryKeyUUID } from 'src/database/common/helpers/mikro-orm/PrimaryKeyUUID';

export enum HopStage {
  BOIL = 'boil',
  WHIRLPOOL = 'whirlpool',
  DRY_HOP = 'dry_hop',
}

@Entity()
export class RecipeHop {
  @PrimaryKeyUUID()
  id!: string;

  @ManyToOne(() => Recipe)
  recipe!: Recipe;

  @ManyToOne(() => Hop)
  hop!: Hop;

  @Property({ type: 'decimal', nullable: true })
  amount!: number | null;

  @Property({ nullable: true })
  boil_time!: number | null;

  @Enum(() => HopStage)
  stage!: HopStage;
}
