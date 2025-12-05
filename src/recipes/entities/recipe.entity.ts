import {
  Entity,
  Property,
  ManyToOne,
  Enum,
  OptionalProps,
  OneToOne,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { User } from 'src/users/entities/user.entity';
import { BeerStyle } from 'src/catalog/entities/beer-style.entity';
import { Equipment } from 'src/catalog/entities/equipment.entity';
import { PropertyCreatedAt } from 'src/database/common/helpers/PropertyCreatedAt';
import { PropertyUpdatedAt } from 'src/database/common/helpers/PropertyUpdatedAt';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';
import { RecipeCarbonation } from './recipe-carbonation.entity';
import { RecipeFermentation } from './recipe-fermentation.entity';
import { RecipeMash } from './recipe-mash.entity';
import { RecipeFermentable } from './recipe-fermentable.entity';
import { RecipeHop } from './recipe-hop.entity';
import { RecipeYeast } from './recipe-yeast.entity';
import { RecipeWater } from './recipe-water.entity';

export enum RecipeType {
  ALL_GRAIN = 'all_grain',
  PARTIAL_MASH = 'partial_mash',
  EXTRACT = 'extract',
}

@Entity()
export class Recipe {
  @PrimaryKeyUUID()
  id!: string;

  @ManyToOne(() => User, { nullable: true })
  user!: User | null;

  @ManyToOne(() => BeerStyle)
  beerStyle!: BeerStyle;

  @ManyToOne(() => Equipment, { nullable: true })
  equipment!: Equipment | null;

  @OneToOne(() => RecipeMash, (recipeMash) => recipeMash.recipe, {
    nullable: true,
  })
  mash?: RecipeMash;

  @OneToOne(
    () => RecipeFermentation,
    (recipeFermentation) => recipeFermentation.recipe,
    { nullable: true },
  )
  fermentation?: RecipeFermentation;

  @OneToOne(
    () => RecipeCarbonation,
    (recipeCarbonation) => recipeCarbonation.recipe,
    { nullable: true },
  )
  carbonation?: RecipeCarbonation;

  @OneToMany(
    () => RecipeFermentable,
    (recipeFermentable) => recipeFermentable.recipe,
    { orphanRemoval: true },
  )
  fermentables = new Collection<RecipeFermentable>(this);

  @OneToMany(() => RecipeHop, (recipeHop) => recipeHop.recipe, {
    orphanRemoval: true,
  })
  hops = new Collection<RecipeHop>(this);

  @OneToMany(() => RecipeYeast, (recipeYeast) => recipeYeast.recipe, {
    orphanRemoval: true,
  })
  yeasts = new Collection<RecipeYeast>(this);

  @OneToMany(() => RecipeWater, (recipeWater) => recipeWater.recipe, {
    orphanRemoval: true,
  })
  waters = new Collection<RecipeWater>(this);

  @Property()
  name!: string;

  @Property({ type: 'text', nullable: true })
  imageUrl!: string | null;

  @Property({ type: 'text', nullable: true })
  about!: string | null;

  @Property({ type: 'text', nullable: true })
  notes!: string | null;

  @Enum(() => RecipeType)
  type!: RecipeType;

  @Property({ type: 'decimal', nullable: true })
  plannedVolume!: number | null;

  @Property({ type: 'decimal', nullable: true })
  finalVolume!: number | null;

  @Property({ type: 'decimal', nullable: true })
  mashVolume!: number | null;

  @Property({ type: 'decimal', nullable: true })
  boilTime!: number | null;

  @Property({ type: 'decimal', nullable: true })
  originalGravity!: number | null;

  @Property({ type: 'decimal', nullable: true })
  finalGravity!: number | null;

  @Property({ type: 'decimal', nullable: true })
  estimatedIbu!: number | null;

  @Property({ type: 'decimal', nullable: true })
  estimatedColor!: number | null;

  @Property({ type: 'decimal', nullable: true })
  estimatedAbv!: number | null;

  @Property({ type: 'decimal', nullable: true })
  plannedEfficiency!: number | null;

  @Property({ type: 'decimal', nullable: true })
  actualEfficiency!: number | null;

  @PropertyCreatedAt()
  createdAt!: Date;

  @PropertyUpdatedAt()
  updatedAt!: Date;

  @Property({ type: 'date', nullable: true })
  brewDate!: Date | null;

  public readonly [OptionalProps]!: 'createdAt' | 'updatedAt';
}
