import {
  Entity,
  Property,
  OneToMany,
  Collection,
  Enum,
  ManyToOne,
} from '@mikro-orm/core';
import { FermentationStep } from './fermentation-step.entity';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';
import { PropertyCreatedAt } from 'src/database/common/helpers/PropertyCreatedAt';
import { PropertyUpdatedAt } from 'src/database/common/helpers/PropertyUpdatedAt';
import { User } from 'src/users/entities/user.entity';

export enum FermentationProfileType {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  LAGERING = 'lagering',
  CONDITIONING = 'conditioning',
  BOTTLE_CONDITIONING = 'bottle_conditioning',
  KEG_CONDITIONING = 'keg_conditioning',
}

@Entity()
export class FermentationProfile {
  @PrimaryKeyUUID()
  id!: string;

  @Property()
  name!: string;

  @ManyToOne(() => User, { nullable: true })
  user!: User | null;

  @Enum(() => FermentationProfileType)
  type!: FermentationProfileType;

  @OneToMany(
    () => FermentationStep,
    (fermentationStep) => fermentationStep.fermentationProfile,
    { orphanRemoval: true },
  )
  steps = new Collection<FermentationStep>(this);

  @Property({ nullable: true })
  yeastStrain!: string | null;

  @Property({ type: 'decimal', nullable: true })
  targetFinalGravity!: number | null;

  @Property({ type: 'decimal', nullable: true })
  estimatedAttenuation!: number | null;

  @Property({ default: false })
  isMultiStage!: boolean;

  @Property({ type: 'text', nullable: true })
  observations!: string | null;

  @Property()
  isPublic: boolean = false;

  @PropertyCreatedAt()
  createdAt!: Date;

  @PropertyUpdatedAt()
  updatedAt!: Date;
}
