import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { Yeast } from 'src/catalog/entities/yeast.entity';
import {
  BaseInventoryItem,
  InventoryItemType,
} from './base-inventory-item.entity';

export enum YeastInventoryUnit {
  PACK = 'pack', // Sachês
  VIAL = 'vial', // Frascos líquidos
  SLURRY_ML = 'slurry_ml', // Slurry em ml
  CELLS_BILLION = 'cells_billion', // Bilhões de células
}

@Entity()
export class YeastInventoryItem extends BaseInventoryItem {
  @ManyToOne(() => Yeast)
  yeast!: Yeast;

  @Property()
  unit!: YeastInventoryUnit;

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

  constructor() {
    super();
    this.type = InventoryItemType.YEAST;
  }

  /**
   * Calcula a viabilidade atual baseada na idade do fermento
   */
  get currentViability(): number | null {
    if (!this.viability || !this.productionDate) return this.viability;

    const monthsOld =
      (new Date().getTime() - this.productionDate.getTime()) /
      (1000 * 60 * 60 * 24 * 30);

    // Degradação da viabilidade: aproximadamente 20% por mês para fermento líquido
    const degradationRate = this.unit === YeastInventoryUnit.VIAL ? 0.2 : 0.1;
    const degradationFactor = Math.pow(1 - degradationRate, monthsOld);

    return Math.max(0, this.viability * degradationFactor);
  }

  /**
   * Calcula o número de células viáveis atuais
   */
  get currentCellCount(): number | null {
    if (!this.cellCount) return null;

    const currentViabilityRatio = this.currentViability
      ? this.currentViability / 100
      : 1;
    return this.cellCount * currentViabilityRatio;
  }

  /**
   * Verifica se o fermento precisa de starter baseado na viabilidade
   */
  get needsStarter(): boolean {
    const currentViab = this.currentViability;
    if (!currentViab) return false;

    return currentViab < 80; // Abaixo de 80% de viabilidade recomenda-se starter
  }

  /**
   * Calcula a quantidade de células necessárias para um volume de mosto
   */
  calculateCellsNeeded(wortVolumeL: number, wortGravity: number): number {
    // Fórmula padrão: 0.75 milhões de células por mL por grau Plato para ales
    // 1.5 milhões para lagers
    const cellsPerMlPerPlato = 0.75 * 1000000; // Assumindo ale
    const plato = (wortGravity - 1) * 250; // Conversão aproximada SG para Plato

    return wortVolumeL * 1000 * cellsPerMlPerPlato * plato;
  }
}
