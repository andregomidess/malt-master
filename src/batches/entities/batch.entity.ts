import { Entity, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { User } from 'src/users/entities/user.entity';
import { Recipe } from 'src/recipes/entities/recipe.entity';
import { Equipment } from 'src/catalog/entities/equipment.entity';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';

export enum BatchStatus {
  PLANNED = 'planned',
  FERMENTING = 'fermenting',
  MATURING = 'maturing',
  PACKAGED = 'packaged',
  COMPLETED = 'completed',
}

@Entity()
export class Batch {
  @PrimaryKeyUUID()
  id!: string;

  @ManyToOne(() => Recipe)
  recipe!: Recipe;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Equipment, { nullable: true })
  equipment!: Equipment | null;

  @Property({ nullable: true })
  batchCode!: string | null;

  @Property({ nullable: true })
  name!: string | null;

  @Property({ type: 'date', nullable: true })
  brewDate!: Date | null;

  @Property({ type: 'date', nullable: true })
  packagingDate!: Date | null;

  @Property({ type: 'date', nullable: true })
  readyDate!: Date | null;

  @Enum(() => BatchStatus)
  status!: BatchStatus;

  @Property({ type: 'decimal', nullable: true })
  plannedVolume!: number | null;

  @Property({ type: 'decimal', nullable: true })
  finalVolume!: number | null;

  @Property({ type: 'decimal', nullable: true })
  actualOriginalGravity!: number | null;

  @Property({ type: 'decimal', nullable: true })
  actualFinalGravity!: number | null;

  @Property({ type: 'decimal', nullable: true })
  actualIbu!: number | null;

  @Property({ type: 'decimal', nullable: true })
  actualColor!: number | null;

  @Property({ type: 'decimal', nullable: true })
  actualAbv!: number | null;

  @Property({ type: 'decimal', nullable: true })
  actualEfficiency!: number | null;

  @Property({ type: 'decimal', nullable: true })
  fermentationTemperature!: number | null;

  @Property({ nullable: true })
  fermentationTime!: number | null;

  @Property({ type: 'decimal', nullable: true })
  actualCarbonation!: number | null;

  @Property({ type: 'text', nullable: true })
  observations!: string | null;
}
