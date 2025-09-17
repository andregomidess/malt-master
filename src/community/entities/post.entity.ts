import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { User } from 'src/users/entities/user.entity';
import { PropertyCreatedAt } from 'src/database/common/helpers/mikro-orm/PropertyCreatedAt';
import { PrimaryKeyUUID } from 'src/database/common/helpers/mikro-orm/PrimaryKeyUUID';

@Entity()
export class Post {
  @PrimaryKeyUUID()
  id!: string;

  @ManyToOne(() => User)
  user!: User;

  @Property({ nullable: true })
  title!: string | null;

  @Property({ type: 'text', nullable: true })
  content!: string | null;

  @PropertyCreatedAt()
  createdAt!: Date;

  @Property({ nullable: true })
  category!: string | null;
}
