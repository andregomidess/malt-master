import { Entity, ManyToOne, OptionalProps, Property } from '@mikro-orm/core';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';
import { PropertyCreatedAt } from 'src/database/common/helpers/PropertyCreatedAt';
import { PropertyDeletedAt } from 'src/database/common/helpers/PropertyDeletedAt';
import { PropertyUpdatedAt } from 'src/database/common/helpers/PropertyUpdatedAt';
import { User } from 'src/users/entities/user.entity';

export enum BeerTag {
  HOPPY = 'HOPPY',
  MALTY = 'MALTY',
  FRUITY = 'FRUITY',
  SPICY = 'SPICY',
  ROASTED = 'ROASTED',
  DARK = 'DARK',
  LIGHT = 'LIGHT',
  SOUR = 'SOUR',
  SWEET = 'SWEET',
  BITTER = 'BITTER',
  SMOOTH = 'SMOOTH',
  CRISP = 'CRISP',
  REFRESHING = 'REFRESHING',
  COMPLEX = 'COMPLEX',
  TRADITIONAL = 'TRADITIONAL',
  MODERN = 'MODERN',
  SESSIONABLE = 'SESSIONABLE',
  STRONG = 'STRONG',
  WHEAT = 'WHEAT',
  COFFEE = 'COFFEE',
  CHOCOLATE = 'CHOCOLATE',
  CARAMEL = 'CARAMEL',
  CITRUS = 'CITRUS',
  TROPICAL = 'TROPICAL',
  FLORAL = 'FLORAL',
  EARTHY = 'EARTHY',
  HERBAL = 'HERBAL',
  SMOKY = 'SMOKY',
}

export enum GlasswareType {
  PINT = 'PINT',
  PILSNER = 'PILSNER',
  WEIZEN = 'WEIZEN',
  TULIP = 'TULIP',
  SNIFTER = 'SNIFTER',
  STOUT_GLASS = 'STOUT_GLASS',
  GOBLET_CHALICE = 'GOBLET_CHALICE',
  STEIN = 'STEIN',
  MUG = 'MUG',
}

@Entity()
export class BeerStyle {
  @PrimaryKeyUUID()
  id!: string;

  @Property({ unique: true })
  name!: string;

  @ManyToOne(() => User, { nullable: true })
  user!: User | null;

  @Property({ nullable: true })
  category!: string | null;

  @Property({ nullable: true })
  subCategory!: string | null;

  @Property({ type: 'double', nullable: true })
  minAbv!: number | null;

  @Property({ type: 'double', nullable: true })
  maxAbv!: number | null;

  @Property({ type: 'double', nullable: true })
  minOg!: number | null;

  @Property({ type: 'double', nullable: true })
  maxOg!: number | null;

  @Property({ type: 'double', nullable: true })
  minFg!: number | null;

  @Property({ type: 'double', nullable: true })
  maxFg!: number | null;

  @Property({ type: 'double', nullable: true })
  minIbu!: number | null;

  @Property({ type: 'double', nullable: true })
  maxIbu!: number | null;

  @Property({ type: 'double', nullable: true })
  minColorEbc!: number | null;

  @Property({ type: 'double', nullable: true })
  maxColorEbc!: number | null;

  @Property({ type: 'text', nullable: true })
  description!: string | null;

  @Property({ type: 'text', nullable: true })
  aroma!: string | null;

  @Property({ type: 'text', nullable: true })
  appearance!: string | null;

  @Property({ type: 'text', nullable: true })
  flavor!: string | null;

  @Property({ type: 'text', nullable: true })
  mouthfeel!: string | null;

  @Property({ type: 'text', nullable: true })
  comments!: string | null;

  @Property({ type: 'text', nullable: true })
  history!: string | null;

  @Property({ type: 'text', nullable: true })
  ingredients!: string | null;

  @Property({ type: 'json' })
  tags!: BeerTag[];

  @Property({ type: 'text', nullable: true })
  examples!: string | null;

  @Property({ nullable: true })
  origin!: string | null;

  @Property({ nullable: true })
  glassware!: GlasswareType | null;

  @PropertyCreatedAt()
  createdAt!: Date;

  @PropertyUpdatedAt()
  updatedAt!: Date | null;

  @PropertyDeletedAt()
  deletedAt!: Date | null;

  public readonly [OptionalProps]!: 'updatedAt' | 'deletedAt';
}
