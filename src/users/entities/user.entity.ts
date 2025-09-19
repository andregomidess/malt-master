import { Entity, OptionalProps, Property, Filter } from '@mikro-orm/core';
import { PropertyCreatedAt } from 'src/database/common/helpers/PropertyCreatedAt';
import { PropertyUpdatedAt } from 'src/database/common/helpers/PropertyUpdatedAt';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';
import { PropertyDeletedAt } from 'src/database/common/helpers/PropertyDeletedAt';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum UserStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
}

export enum UserGender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Entity()
@Filter({
  name: 'softDelete',
  cond: { deletedAt: null },
  default: true,
})
export class User {
  @PrimaryKeyUUID()
  id!: string;

  @Property()
  firstName!: string;

  @Property()
  lastName!: string;

  @Property()
  pictureUrl!: string | null;

  @Property()
  city!: string;

  @Property()
  state!: string;

  @Property()
  country!: string;

  @Property({ default: UserRole.USER })
  role!: UserRole;

  @Property({ default: UserStatus.PENDING_VERIFICATION })
  status!: UserStatus;

  @Property()
  gender!: UserGender;

  @Property()
  email!: string;

  @Property()
  password!: string;

  @Property({ nullable: true })
  emailVerificationToken?: string | null;

  @Property({ nullable: true })
  emailVerifiedAt?: Date | null;

  @Property({ nullable: true })
  refreshToken?: string | null;

  @PropertyCreatedAt()
  createdAt!: Date;

  @PropertyUpdatedAt()
  updatedAt!: Date;

  @PropertyDeletedAt()
  deletedAt!: Date | null;

  public readonly [OptionalProps]!: 'updatedAt' | 'deletedAt';
}
