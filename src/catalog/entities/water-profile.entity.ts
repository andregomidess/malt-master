import { Entity, Property } from '@mikro-orm/core';
import { PrimaryKeyUUID } from 'src/database/common/helpers/mikro-orm/PrimaryKeyUUID';

@Entity()
export class WaterProfile {
  @PrimaryKeyUUID()
  id!: string;

  @Property()
  name!: string;

  @Property({ nullable: true })
  origin!: string | null;

  @Property({ type: 'decimal', nullable: true })
  ca!: number | null;

  @Property({ type: 'decimal', nullable: true })
  mg!: number | null;

  @Property({ type: 'decimal', nullable: true })
  na!: number | null;

  @Property({ type: 'decimal', nullable: true })
  so4!: number | null;

  @Property({ type: 'decimal', nullable: true })
  cl!: number | null;

  @Property({ type: 'decimal', nullable: true })
  hco3!: number | null;

  @Property({ type: 'decimal', nullable: true })
  ph!: number | null;

  @Property({ nullable: true })
  recommendedStyle!: string | null;

  @Property({ type: 'text', nullable: true })
  observations!: string | null;
}
