import { Entity, Property, OneToMany, Collection, Enum } from '@mikro-orm/core';
import { FermentationStep } from './fermentation-step.entity';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';

export enum FermentationProfileType {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  LAGERING = 'lagering',
  CONDITIONING = 'conditioning',
}

@Entity()
export class FermentationProfile {
  @PrimaryKeyUUID()
  id!: string;

  @Property()
  name!: string;

  @Enum(() => FermentationProfileType)
  type!: FermentationProfileType;

  @Property({ type: 'text', nullable: true })
  observations!: string | null;

  @OneToMany(
    () => FermentationStep,
    (fermentationStep) => fermentationStep.fermentation_profile,
  )
  steps = new Collection<FermentationStep>(this);
}
