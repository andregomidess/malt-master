import { Entity, Property, Enum } from '@mikro-orm/core';
import { PrimaryKeyUUID } from 'src/database/common/helpers/mikro-orm/PrimaryKeyUUID';

export enum CarbonationType {
  NATURAL_PRIMING = 'natural_priming',
  FORCED_CO2 = 'forced_co2',
}

@Entity()
export class CarbonationProfile {
  @PrimaryKeyUUID()
  id!: string;

  @Property()
  name!: string;

  @Enum(() => CarbonationType)
  type!: CarbonationType;

  @Property({ nullable: true })
  recommendedAmount!: string | null;

  @Property({ type: 'text', nullable: true })
  observations!: string | null;
}
