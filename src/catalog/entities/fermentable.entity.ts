import { Entity, Property, ManyToOne, Enum } from '@mikro-orm/core';
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
  user!: User;

  @Property({ unique: true })
  name!: string;

  @Enum(() => FermentableType)
  type!: FermentableType;

  @Property({ type: 'decimal', nullable: true })
  color!: number | null;

  @Property({ type: 'decimal', nullable: true })
  yield!: number | null;

  @Property({ nullable: true })
  origin!: string | null;

  @Property({ nullable: true })
  supplier!: string | null;

  @Enum(() => FermentableForm)
  form!: FermentableForm;

  @Property({ type: 'text', nullable: true })
  notes!: string | null;
}
