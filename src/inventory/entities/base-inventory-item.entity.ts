import { Entity, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';
import { PropertyCreatedAt } from 'src/database/common/helpers/PropertyCreatedAt';
import { PropertyUpdatedAt } from 'src/database/common/helpers/PropertyUpdatedAt';
import { Inventory } from './inventory.entity';

export enum InventoryItemType {
  FERMENTABLE = 'fermentable',
  HOP = 'hop',
  YEAST = 'yeast',
}

@Entity({ abstract: true })
export abstract class BaseInventoryItem {
  @PrimaryKeyUUID()
  id!: string;

  @ManyToOne(() => Inventory)
  inventory!: Inventory;

  @Enum(() => InventoryItemType)
  type!: InventoryItemType;

  @Property({ type: 'decimal' })
  quantity!: number;

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

  /**
   * Calcula o valor total do item no inventário
   */
  get totalValue(): number {
    return (this.costPerUnit || 0) * this.quantity;
  }

  /**
   * Verifica se o item está próximo do vencimento (30 dias)
   */
  get isNearExpiry(): boolean {
    if (!this.bestBeforeDate) return false;
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return this.bestBeforeDate <= thirtyDaysFromNow;
  }

  /**
   * Verifica se o item está vencido
   */
  get isExpired(): boolean {
    if (!this.bestBeforeDate) return false;
    return this.bestBeforeDate < new Date();
  }

  /**
   * Calcula quantos dias restam até o vencimento
   */
  get daysUntilExpiry(): number | null {
    if (!this.bestBeforeDate) return null;
    const today = new Date();
    const diffTime = this.bestBeforeDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
