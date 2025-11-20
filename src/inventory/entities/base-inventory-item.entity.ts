import { Entity, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';
import { PropertyCreatedAt } from 'src/database/common/helpers/PropertyCreatedAt';
import { PropertyUpdatedAt } from 'src/database/common/helpers/PropertyUpdatedAt';
import type { Inventory } from './inventory.entity';

export enum InventoryItemType {
  FERMENTABLE = 'fermentable',
  HOP = 'hop',
  YEAST = 'yeast',
}

@Entity({ abstract: true })
export abstract class BaseInventoryItem {
  @PrimaryKeyUUID()
  id!: string;

  @ManyToOne({ entity: () => 'Inventory' })
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

  get totalValue(): number {
    return (this.costPerUnit || 0) * this.quantity;
  }

  private getBestBeforeDateAsDate(): Date | null {
    if (!this.bestBeforeDate) return null;
    if (this.bestBeforeDate instanceof Date) return this.bestBeforeDate;
    return new Date(this.bestBeforeDate);
  }

  protected getPurchaseDateAsDate(): Date | null {
    if (!this.purchaseDate) return null;
    if (this.purchaseDate instanceof Date) return this.purchaseDate;
    return new Date(this.purchaseDate);
  }

  protected getDateAsDate(date: Date | string | null): Date | null {
    if (!date) return null;
    if (date instanceof Date) return date;
    return new Date(date);
  }

  get isNearExpiry(): boolean {
    const bestBeforeDate = this.getBestBeforeDateAsDate();
    if (!bestBeforeDate) return false;
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return bestBeforeDate <= thirtyDaysFromNow;
  }

  get isExpired(): boolean {
    const bestBeforeDate = this.getBestBeforeDateAsDate();
    if (!bestBeforeDate) return false;
    return bestBeforeDate < new Date();
  }

  get daysUntilExpiry(): number | null {
    const bestBeforeDate = this.getBestBeforeDateAsDate();
    if (!bestBeforeDate) return null;
    const today = new Date();
    const diffTime = bestBeforeDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
