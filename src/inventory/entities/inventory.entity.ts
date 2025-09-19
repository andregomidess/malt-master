import { Entity, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { User } from 'src/users/entities/user.entity';
import { Hop } from 'src/catalog/entities/hop.entity';
import { Fermentable } from 'src/catalog/entities/fermentable.entity';
import { Yeast } from 'src/catalog/entities/yeast.entity';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';

export enum InventoryUnit {
  G = 'g',
  KG = 'kg',
  UNIT = 'unit',
  PKG = 'pkg',
  ML = 'ml',
}

@Entity()
export class Inventory {
  @PrimaryKeyUUID()
  id!: string;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Hop, { nullable: true })
  hop!: Hop | null;

  @ManyToOne(() => Fermentable, { nullable: true })
  fermentable!: Fermentable | null;

  @ManyToOne(() => Yeast, { nullable: true })
  yeast!: Yeast | null;

  @Property({ type: 'decimal' })
  quantity!: number;

  @Enum(() => InventoryUnit)
  unit!: InventoryUnit;

  @Property({ type: 'date', nullable: true })
  purchaseDate!: Date | null;

  @Property({ type: 'date', nullable: true })
  bestBeforeDate!: Date | null;

  @Property({ type: 'decimal', nullable: true })
  cost!: number | null;

  @Property({ type: 'text', nullable: true })
  notes!: string | null;
}
