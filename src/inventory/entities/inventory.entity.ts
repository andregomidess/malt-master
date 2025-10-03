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
import { FermentableInventoryItem } from './fermentable-inventory-item.entity';
import { HopInventoryItem } from './hop-inventory-item.entity';
import { YeastInventoryItem } from './yeast-inventory-item.entity';
import { BaseInventoryItem } from './base-inventory-item.entity';

/**
 * Representa o inventário único de um usuário
 * Contém todos os itens de ingredientes para produção de cerveja
 */
@Entity()
export class Inventory {
  @PrimaryKeyUUID()
  id!: string;

  @ManyToOne(() => User, { unique: true })
  user!: User;

  @OneToMany(() => FermentableInventoryItem, 'inventory')
  fermentableItems = new Collection<FermentableInventoryItem>(this);

  @OneToMany(() => HopInventoryItem, 'inventory')
  hopItems = new Collection<HopInventoryItem>(this);

  @OneToMany(() => YeastInventoryItem, 'inventory')
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

  /**
   * Calcula o valor total do inventário
   */
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

  /**
   * Conta o total de itens no inventário
   */
  get totalItems(): number {
    return (
      this.fermentableItems.length +
      this.hopItems.length +
      this.yeastItems.length
    );
  }

  /**
   * Obtém todos os itens próximos do vencimento
   */
  get itemsNearExpiry(): BaseInventoryItem[] {
    const allItems = [
      ...this.fermentableItems.getItems(),
      ...this.hopItems.getItems(),
      ...this.yeastItems.getItems(),
    ];

    return allItems.filter((item) => item.isNearExpiry);
  }

  /**
   * Obtém todos os itens vencidos
   */
  get expiredItems(): BaseInventoryItem[] {
    const allItems = [
      ...this.fermentableItems.getItems(),
      ...this.hopItems.getItems(),
      ...this.yeastItems.getItems(),
    ];

    return allItems.filter((item) => item.isExpired);
  }
}
