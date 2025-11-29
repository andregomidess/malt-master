import {
  Entity,
  Property,
  Enum,
  OptionalProps,
  ManyToOne,
} from '@mikro-orm/core';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';
import { PropertyCreatedAt } from 'src/database/common/helpers/PropertyCreatedAt';
import { PropertyUpdatedAt } from 'src/database/common/helpers/PropertyUpdatedAt';
import { User } from 'src/users/entities/user.entity';

export enum CarbonationType {
  NATURAL_PRIMING = 'natural_priming',
  FORCED_CO2 = 'forced_co2',
  BOTTLE_CONDITIONING = 'bottle_conditioning',
}

export enum PrimingSugarType {
  TABLE_SUGAR = 'table_sugar',
  CORN_SUGAR = 'corn_sugar',
  DME = 'dme',
  HONEY = 'honey',
  MAPLE_SYRUP = 'maple_syrup',
}

@Entity()
export class CarbonationProfile {
  @PrimaryKeyUUID()
  id!: string;

  @Property()
  name!: string;

  @ManyToOne(() => User)
  user!: User;

  @Enum(() => CarbonationType)
  type!: CarbonationType;

  @Property({ type: 'decimal' })
  targetCO2Volumes!: number;

  @Property({ type: 'decimal', default: 4 })
  servingTemperature!: number;

  @Enum(() => PrimingSugarType)
  primingSugarType!: PrimingSugarType | null;

  @Property({ type: 'decimal', nullable: true })
  primingSugarAmount!: number | null;

  @Property({ type: 'decimal', nullable: true })
  kegPressure!: number | null;

  @Property({ nullable: true })
  carbonationTime!: number | null;

  @Property({ nullable: true })
  carbonationMethod!: string | null;

  @Property({ type: 'text', nullable: true })
  observations!: string | null;

  @Property()
  isPublic: boolean = false;

  @PropertyCreatedAt()
  createdAt!: Date;

  @PropertyUpdatedAt()
  updatedAt!: Date;

  public readonly [OptionalProps]!: 'updatedAt' | 'createdAt';
}
