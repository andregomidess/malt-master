import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { User } from 'src/users/entities/user.entity';
import { Hop } from 'src/catalog/entities/hop.entity';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';
import { PropertyCreatedAt } from 'src/database/common/helpers/PropertyCreatedAt';
import { PropertyUpdatedAt } from 'src/database/common/helpers/PropertyUpdatedAt';

export enum HopInventoryUnit {
  G = 'g',
  KG = 'kg',
  OZ = 'oz', // Onças para lúpulos
}

@Entity()
export class HopInventory {
  @PrimaryKeyUUID()
  id!: string;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Hop)
  hop!: Hop;

  @Property({ type: 'decimal' })
  quantity!: number;

  @Property()
  unit!: HopInventoryUnit;

  @Property({ type: 'date', nullable: true })
  purchaseDate!: Date | null;

  @Property({ type: 'date', nullable: true })
  bestBeforeDate!: Date | null;

  @Property({ type: 'decimal', nullable: true })
  costPerUnit!: number | null; // Custo por grama/kg

  @Property({ type: 'text', nullable: true })
  notes!: string | null;

  // Propriedades específicas de lúpulo
  @Property({ type: 'decimal', nullable: true })
  alphaAcidsAtPurchase!: number | null; // AA% no momento da compra

  @Property({ nullable: true })
  harvestYear!: number | null;

  @Property({ nullable: true })
  storageCondition!: string | null; // Freezer, geladeira, etc.

  @PropertyCreatedAt()
  createdAt!: Date;

  @PropertyUpdatedAt()
  updatedAt!: Date;
}
