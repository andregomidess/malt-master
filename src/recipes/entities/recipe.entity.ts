import {
  Entity,
  Property,
  ManyToOne,
  Enum,
  OptionalProps,
} from '@mikro-orm/core';
import { User } from 'src/users/entities/user.entity';
import { BeerStyle } from 'src/catalog/entities/beer-style.entity';
import { Equipment } from 'src/catalog/entities/equipment.entity';
import { PropertyCreatedAt } from 'src/database/common/helpers/mikro-orm/PropertyCreatedAt';
import { PropertyUpdatedAt } from 'src/database/common/helpers/mikro-orm/PropertyUpdatedAt';
import { PrimaryKeyUUID } from 'src/database/common/helpers/mikro-orm/PrimaryKeyUUID';

export enum RecipeType {
  ALL_GRAIN = 'all_grain',
  PARTIAL_MASH = 'partial_mash',
  EXTRACT = 'extract',
}

@Entity()
export class Recipe {
  @PrimaryKeyUUID()
  id!: string;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => BeerStyle)
  beerStyle!: BeerStyle;

  @ManyToOne(() => Equipment, { nullable: true })
  equipment!: Equipment | null;

  @Property()
  name!: string;

  @Property({ nullable: true })
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

  public readonly [OptionalProps]!: 'updatedAt';
}
