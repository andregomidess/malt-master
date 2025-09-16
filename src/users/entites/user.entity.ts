import { Entity, Property } from '@mikro-orm/core';
import { PropertyCreatedAt } from 'src/common/helpers/mikro-orm/PropertyCreatedAt';
import { PropertyUpdatedAt } from 'src/common/helpers/mikro-orm/PropertyUpdatedAt';
import { PropertyDeletedAt } from 'src/common/helpers/mikro-orm/PropertyDeletedAt';
import { PrimaryKeyUUID } from 'src/common/helpers/mikro-orm/PrimaryKeyUUID';

@Entity()
export class User {
  @PrimaryKeyUUID()
  id!: string;

  @Property()
  name!: string;

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
}
