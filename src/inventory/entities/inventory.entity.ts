import {
  Entity,
  OneToMany,
  Collection,
  ManyToOne,
  OptionalProps,
} from '@mikro-orm/core';
import { User } from 'src/users/entities/user.entity';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';
import { PropertyCreatedAt } from 'src/database/common/helpers/PropertyCreatedAt';
import { PropertyUpdatedAt } from 'src/database/common/helpers/PropertyUpdatedAt';
import type { FermentableInventoryItem } from './fermentable-inventory-item.entity';
import type { HopInventoryItem } from './hop-inventory-item.entity';
import type { YeastInventoryItem } from './yeast-inventory-item.entity';
import type { BaseInventoryItem } from './base-inventory-item.entity';

@Entity()
export class Inventory {
  @PrimaryKeyUUID()
  id!: string;

  @ManyToOne(() => User, { unique: true })
  user!: User;

  @OneToMany({
    entity: () => 'FermentableInventoryItem',
    mappedBy: 'inventory',
  })
  fermentableItems = new Collection<FermentableInventoryItem>(this);

  @OneToMany({ entity: () => 'HopInventoryItem', mappedBy: 'inventory' })
  hopItems = new Collection<HopInventoryItem>(this);

  @OneToMany({ entity: () => 'YeastInventoryItem', mappedBy: 'inventory' })
  yeastItems = new Collection<YeastInventoryItem>(this);

  @PropertyCreatedAt()
  createdAt!: Date;

  @PropertyUpdatedAt()
  updatedAt!: Date;

  public readonly [OptionalProps]!:
    | 'createdAt'
    | 'updatedAt'
    | 'totalValue'
    | 'totalItems'
    | 'itemsNearExpiry'
    | 'expiredItems';

  get totalValue(): number {
    const fermentableValue = this.fermentableItems
      .getItems()
      .reduce((sum, item) => sum + item.totalValue, 0);
    const hopValue = this.hopItems
      .getItems()
      .reduce((sum, item) => sum + item.totalValue, 0);
    const yeastValue = this.yeastItems
      .getItems()
      .reduce((sum, item) => sum + item.totalValue, 0);

    return fermentableValue + hopValue + yeastValue;
  }

  get totalItems(): number {
    return (
      this.fermentableItems.length +
      this.hopItems.length +
      this.yeastItems.length
    );
  }

  get itemsNearExpiry(): BaseInventoryItem[] {
    const allItems = [
      ...this.fermentableItems.getItems(),
      ...this.hopItems.getItems(),
      ...this.yeastItems.getItems(),
    ];

    return allItems.filter((item) => item.isNearExpiry);
  }

  get expiredItems(): BaseInventoryItem[] {
    const allItems = [
      ...this.fermentableItems.getItems(),
      ...this.hopItems.getItems(),
      ...this.yeastItems.getItems(),
    ];

    return allItems.filter((item) => item.isExpired);
  }
}
