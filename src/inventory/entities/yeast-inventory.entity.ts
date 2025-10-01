import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { User } from 'src/users/entities/user.entity';
import { Yeast } from 'src/catalog/entities/yeast.entity';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';
import { PropertyCreatedAt } from 'src/database/common/helpers/PropertyCreatedAt';
import { PropertyUpdatedAt } from 'src/database/common/helpers/PropertyUpdatedAt';

export enum YeastInventoryUnit {
  PACK = 'pack', // Sachês
  VIAL = 'vial', // Frascos líquidos
  SLURRY_ML = 'slurry_ml', // Slurry em ml
  CELLS_BILLION = 'cells_billion', // Bilhões de células
}

@Entity()
export class YeastInventory {
  @PrimaryKeyUUID()
  id!: string;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Yeast)
  yeast!: Yeast;

  @Property({ type: 'decimal' })
  quantity!: number;

  @Property()
  unit!: YeastInventoryUnit;

  @Property({ type: 'date', nullable: true })
  purchaseDate!: Date | null;

  @Property({ type: 'date', nullable: true })
  bestBeforeDate!: Date | null;

  @Property({ type: 'decimal', nullable: true })
  costPerUnit!: number | null;

  @Property({ type: 'text', nullable: true })
  notes!: string | null;

  @Property({ type: 'date', nullable: true })
  productionDate!: Date | null;

  @Property({ type: 'decimal', nullable: true })
  viability!: number | null;

  @Property({ type: 'bigint', nullable: true })
  cellCount!: number | null;

  @Property({ nullable: true })
  starter!: boolean | null;

  @Property({ type: 'decimal', nullable: true })
  pitchingRate!: number | null;

  @PropertyCreatedAt()
  createdAt!: Date;

  @PropertyUpdatedAt()
  updatedAt!: Date;
}
