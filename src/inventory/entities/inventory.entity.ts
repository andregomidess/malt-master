import { Entity, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { User } from 'src/users/entities/user.entity';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';
import { PropertyCreatedAt } from 'src/database/common/helpers/PropertyCreatedAt';
import { PropertyUpdatedAt } from 'src/database/common/helpers/PropertyUpdatedAt';

export enum InventoryType {
  HOP = 'hop',
  FERMENTABLE = 'fermentable',
  YEAST = 'yeast',
}

@Entity()
export class Inventory {
  @PrimaryKeyUUID()
  id!: string;

  @ManyToOne(() => User)
  user!: User;

  @Enum(() => InventoryType)
  type!: InventoryType;

  @Property()
  specificInventoryId!: string;

  @Property({ type: 'decimal' })
  quantity!: number;

  @Property()
  unit!: string;

  @Property({ type: 'date', nullable: true })
  purchaseDate!: Date | null;

  @Property({ type: 'date', nullable: true })
  bestBeforeDate!: Date | null;

  @Property({ type: 'decimal', nullable: true })
  costPerUnit!: number | null;

  @Property({ type: 'text', nullable: true })
  notes!: string | null;

  @PropertyCreatedAt()
  createdAt!: Date;

  @PropertyUpdatedAt()
  updatedAt!: Date;

  get totalValue(): number {
    return (this.costPerUnit || 0) * this.quantity;
  }
}
