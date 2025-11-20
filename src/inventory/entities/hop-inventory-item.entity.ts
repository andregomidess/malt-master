import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { Hop } from 'src/catalog/entities/hop.entity';
import {
  BaseInventoryItem,
  InventoryItemType,
} from './base-inventory-item.entity';

export enum HopInventoryUnit {
  G = 'g',
  KG = 'kg',
  OZ = 'oz',
}

@Entity()
export class HopInventoryItem extends BaseInventoryItem {
  @ManyToOne(() => Hop)
  hop!: Hop;

  @Property()
  unit!: HopInventoryUnit;

  @Property({ type: 'decimal', nullable: true })
  alphaAcidsAtPurchase!: number | null;

  @Property({ nullable: true })
  harvestYear!: number | null;

  @Property({ nullable: true })
  storageCondition!: string | null;

  constructor() {
    super();
    this.type = InventoryItemType.HOP;
  }

  /**
   * Calcula a degradação dos ácidos alfa baseada no tempo e condições de armazenamento
   */
  get currentAlphaAcids(): number | null {
    if (!this.alphaAcidsAtPurchase) return this.alphaAcidsAtPurchase;

    const purchaseDate = this.getPurchaseDateAsDate();
    if (!purchaseDate) return this.alphaAcidsAtPurchase;

    const monthsStored =
      (new Date().getTime() - purchaseDate.getTime()) /
      (1000 * 60 * 60 * 24 * 30);

    // Taxa de degradação baseada nas condições de armazenamento
    let degradationRate = 0.05; // 5% ao mês para condições normais

    if (this.storageCondition?.toLowerCase().includes('freezer')) {
      degradationRate = 0.01; // 1% ao mês no freezer
    } else if (this.storageCondition?.toLowerCase().includes('geladeira')) {
      degradationRate = 0.02; // 2% ao mês na geladeira
    }

    const degradationFactor = Math.pow(1 - degradationRate, monthsStored);
    return this.alphaAcidsAtPurchase * degradationFactor;
  }

  /**
   * Verifica se o lúpulo ainda está em boas condições baseado na idade e armazenamento
   */
  get isStillFresh(): boolean {
    const purchaseDate = this.getPurchaseDateAsDate();
    if (!purchaseDate) return true;

    const monthsStored =
      (new Date().getTime() - purchaseDate.getTime()) /
      (1000 * 60 * 60 * 24 * 30);

    // Critérios baseados no armazenamento
    if (this.storageCondition?.toLowerCase().includes('freezer')) {
      return monthsStored <= 36; // 3 anos no freezer
    } else if (this.storageCondition?.toLowerCase().includes('geladeira')) {
      return monthsStored <= 24; // 2 anos na geladeira
    }

    return monthsStored <= 12; // 1 ano em temperatura ambiente
  }
}
