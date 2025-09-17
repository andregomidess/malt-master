import { Entity, Property, ManyToOne, OptionalProps } from '@mikro-orm/core';
import { User } from 'src/users/entities/user.entity';
import { Batch } from 'src/batches/entities/batch.entity';
import { PrimaryKeyUUID } from 'src/database/common/helpers/mikro-orm/PrimaryKeyUUID';
import { PropertyUpdatedAt } from 'src/database/common/helpers/mikro-orm/PropertyUpdatedAt';
import { PropertyCreatedAt } from 'src/database/common/helpers/mikro-orm/PropertyCreatedAt';
import { PropertyDeletedAt } from 'src/database/common/helpers/mikro-orm/PropertyDeletedAt';

@Entity()
export class TastingNote {
  @PrimaryKeyUUID()
  tastingNoteId!: string;

  @ManyToOne(() => Batch)
  batch!: Batch;

  @ManyToOne(() => User)
  user!: User;

  @Property({ type: 'date', default: 'now()' })
  tastingDate!: Date;

  @Property({ type: 'decimal', nullable: true })
  appearanceScore!: number | null;

  @Property({ type: 'decimal', nullable: true })
  aromaScore!: number | null;

  @Property({ type: 'decimal', nullable: true })
  flavorScore!: number | null;

  @Property({ type: 'decimal', nullable: true })
  mouthfeelScore!: number | null;

  @Property({ type: 'decimal' })
  overallScore!: number;

  @Property({ type: 'text', nullable: true })
  pros!: string | null;

  @Property({ type: 'text', nullable: true })
  cons!: string | null;

  @Property({ type: 'text', nullable: true })
  generalNotes!: string | null;

  @PropertyCreatedAt()
  createdAt!: Date;

  @PropertyUpdatedAt()
  updatedAt!: Date;

  @PropertyDeletedAt()
  deletedAt!: Date;

  public readonly [OptionalProps]!: 'updatedAt' | 'deletedAt';
}
