import { Entity, OptionalProps, Property } from '@mikro-orm/core';
import { PropertyCreatedAt } from 'src/database/common/helpers/mikro-orm/PropertyCreatedAt';
import { PropertyUpdatedAt } from 'src/database/common/helpers/mikro-orm/PropertyUpdatedAt';
import { PropertyDeletedAt } from 'src/database/common/helpers/mikro-orm/PropertyDeletedAt';
import { PrimaryKeyUUID } from 'src/database/common/helpers/mikro-orm/PrimaryKeyUUID';

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

  @PropertyCreatedAt()
  createdAt!: Date;

  @PropertyUpdatedAt()
  updatedAt!: Date;

  @PropertyDeletedAt()
  deletedAt!: Date;

  public readonly [OptionalProps]!: 'updatedAt' | 'deletedAt';
}
