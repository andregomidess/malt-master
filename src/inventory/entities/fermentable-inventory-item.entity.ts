import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { Fermentable } from 'src/catalog/entities/fermentable.entity';
import {
  BaseInventoryItem,
  InventoryItemType,
} from './base-inventory-item.entity';

export enum FermentableInventoryUnit {
  G = 'g',
  KG = 'kg',
  LB = 'lb',
  SACK = 'sack',
}

@Entity()
export class FermentableInventoryItem extends BaseInventoryItem {
  @ManyToOne(() => Fermentable)
  fermentable!: Fermentable;

  @Property()
  unit!: FermentableInventoryUnit;

  @Property({ type: 'decimal', nullable: true })
  extractPotential!: number | null;

  @Property({ nullable: true })
  lotNumber!: string | null;

  @Property({ type: 'decimal', nullable: true })
  moisture!: number | null;

  @Property({ type: 'decimal', nullable: true })
  protein!: number | null;

  constructor() {
    super();
    this.type = InventoryItemType.FERMENTABLE;
  }

  get adjustedExtractPotential(): number | null {
    if (!this.extractPotential || !this.moisture) return this.extractPotential;
    return this.extractPotential * (1 - this.moisture / 100);
  }

  get isQualityAcceptable(): boolean {
    if (this.moisture && this.moisture > 15) return false;
    if (this.protein && this.protein > 13) return false;
    return true;
  }
}
