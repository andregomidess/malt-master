import {
  Entity,
  Property,
  ManyToOne,
  Enum,
  OptionalProps,
} from '@mikro-orm/core';
import { PropertyDeletedAt } from 'src/database/common/helpers/PropertyDeletedAt';
import { PropertyUpdatedAt } from 'src/database/common/helpers/PropertyUpdatedAt';
import { PropertyCreatedAt } from 'src/database/common/helpers/PropertyCreatedAt';
import { User } from 'src/users/entities/user.entity';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';

export enum FermentableType {
  BASE = 'base',
  SPECIALTY = 'specialty',
  SUGAR = 'sugar',
  ADJUNCT = 'adjunct',
}

export enum FermentableForm {
  GRAIN = 'grain',
  DRY_EXTRACT = 'dry_extract',
  LIQUID_EXTRACT = 'liquid_extract',
  SYRUP = 'syrup',
}

@Entity()
export class Fermentable {
  @PrimaryKeyUUID()
  id!: string;

  @ManyToOne(() => User, { nullable: true })
  user!: User | null;

  @Property({ unique: true })
  name!: string;

  @Enum(() => FermentableType)
  type!: FermentableType;

  @Property({ type: 'double', nullable: true })
  color!: number | null;

  @Property({ type: 'double', nullable: true })
  yield!: number | null;

  @Property({ type: 'double', nullable: true })
  ppg!: number | null;

  @Property({ nullable: true })
  origin!: string | null;

  @Property({ nullable: true })
  supplier!: string | null;

  @Enum(() => FermentableForm)
  form!: FermentableForm;

  @Property({ type: 'text', nullable: true })
  notes!: string | null;

  @PropertyCreatedAt()
  createdAt!: Date;

  @PropertyUpdatedAt()
  updatedAt!: Date | null;

  @PropertyDeletedAt()
  deletedAt!: Date | null;

  public readonly [OptionalProps]!: 'updatedAt' | 'deletedAt';
}
