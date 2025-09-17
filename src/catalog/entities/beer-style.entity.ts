import { Entity, Property } from '@mikro-orm/core';
import { PrimaryKeyUUID } from 'src/database/common/helpers/mikro-orm/PrimaryKeyUUID';

@Entity()
export class BeerStyle {
  @PrimaryKeyUUID()
  id!: string;

  @Property()
  name!: string;

  @Property({ nullable: true })
  category!: string | null;

  @Property({ nullable: true })
  subCategory!: string | null;

  @Property({ type: 'decimal', nullable: true })
  minAbv!: number | null;

  @Property({ type: 'decimal', nullable: true })
  maxAbv!: number | null;

  @Property({ type: 'decimal', nullable: true })
  minOg!: number | null;

  @Property({ type: 'decimal', nullable: true })
  maxOg!: number | null;

  @Property({ type: 'decimal', nullable: true })
  minFg!: number | null;

  @Property({ type: 'decimal', nullable: true })
  maxFg!: number | null;

  @Property({ nullable: true })
  minIbu!: number | null;

  @Property({ nullable: true })
  maxIbu!: number | null;

  @Property({ nullable: true })
  minColorEbc!: number | null;

  @Property({ nullable: true })
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

  @Property({ type: 'text', nullable: true })
  examples!: string | null;

  @Property({ nullable: true })
  origin!: string | null;
}
