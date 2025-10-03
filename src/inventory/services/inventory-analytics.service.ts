import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { Inventory } from '../entities/inventory.entity';

import { BaseInventoryItem } from '../entities/base-inventory-item.entity';

@Injectable()
export class InventoryAnalyticsService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepo: EntityRepository<Inventory>,
  ) {}

  private async getUserInventoryWithItems(
    userId: string,
  ): Promise<Inventory | null> {
    return await this.inventoryRepo.findOne(
      { user: userId },
      {
        populate: [
          'fermentableItems',
          'fermentableItems.fermentable',
          'hopItems',
          'hopItems.hop',
          'yeastItems',
          'yeastItems.yeast',
        ],
      },
    );
  }

  async calculateTotalInventoryValue(userId: string): Promise<number> {
    const inventory = await this.getUserInventoryWithItems(userId);
    return inventory?.totalValue || 0;
  }

  async findItemsNearExpiry(userId: string): Promise<BaseInventoryItem[]> {
    const inventory = await this.getUserInventoryWithItems(userId);
    return inventory?.itemsNearExpiry || [];
  }

  async findExpiredItems(userId: string): Promise<BaseInventoryItem[]> {
    const inventory = await this.getUserInventoryWithItems(userId);
    return inventory?.expiredItems || [];
  }

  async getFermentableQualityReport(userId: string) {
    const inventory = await this.getUserInventoryWithItems(userId);

    if (!inventory) return [];

    return inventory.fermentableItems.getItems().map((item) => ({
      id: item.id,
      fermentable: item.fermentable,
      quantity: item.quantity,
      unit: item.unit,
      extractPotential: item.extractPotential,
      adjustedExtractPotential: item.adjustedExtractPotential,
      moisture: item.moisture,
      protein: item.protein,
      isQualityAcceptable: item.isQualityAcceptable,
      totalValue: item.totalValue,
      purchaseDate: item.purchaseDate,
      bestBeforeDate: item.bestBeforeDate,
      daysUntilExpiry: item.daysUntilExpiry,
    }));
  }

  async getHopDegradationReport(userId: string) {
    const inventory = await this.getUserInventoryWithItems(userId);

    if (!inventory) return [];

    return inventory.hopItems.getItems().map((item) => ({
      id: item.id,
      hop: item.hop,
      quantity: item.quantity,
      unit: item.unit,
      alphaAcidsAtPurchase: item.alphaAcidsAtPurchase,
      currentAlphaAcids: item.currentAlphaAcids,
      degradationPercentage:
        item.alphaAcidsAtPurchase && item.currentAlphaAcids
          ? ((item.alphaAcidsAtPurchase - item.currentAlphaAcids) /
              item.alphaAcidsAtPurchase) *
            100
          : null,
      isStillFresh: item.isStillFresh,
      storageCondition: item.storageCondition,
      totalValue: item.totalValue,
      purchaseDate: item.purchaseDate,
      bestBeforeDate: item.bestBeforeDate,
      daysUntilExpiry: item.daysUntilExpiry,
    }));
  }

  async getYeastViabilityReport(userId: string) {
    const inventory = await this.getUserInventoryWithItems(userId);

    if (!inventory) return [];

    return inventory.yeastItems.getItems().map((item) => ({
      id: item.id,
      yeast: item.yeast,
      quantity: item.quantity,
      unit: item.unit,
      originalViability: item.viability,
      currentViability: item.currentViability,
      cellCount: item.cellCount,
      currentCellCount: item.currentCellCount,
      needsStarter: item.needsStarter,
      totalValue: item.totalValue,
      purchaseDate: item.purchaseDate,
      bestBeforeDate: item.bestBeforeDate,
      productionDate: item.productionDate,
      daysUntilExpiry: item.daysUntilExpiry,
    }));
  }

  async getInventoryDashboard(userId: string) {
    const [inventory, fermentableReport, hopReport, yeastReport] =
      await Promise.all([
        this.getUserInventoryWithItems(userId),
        this.getFermentableQualityReport(userId),
        this.getHopDegradationReport(userId),
        this.getYeastViabilityReport(userId),
      ]);

    if (!inventory) {
      return {
        summary: {
          totalValue: 0,
          totalItems: 0,
          itemsNearExpiry: 0,
          expiredItems: 0,
        },
        alerts: {
          nearExpiry: [],
          expired: [],
          lowQualityFermentables: [],
          degradedHops: [],
          lowViabilityYeasts: [],
        },
        reports: {
          fermentables: [],
          hops: [],
          yeasts: [],
        },
      };
    }

    return {
      summary: {
        totalValue: inventory.totalValue,
        totalItems: inventory.totalItems,
        itemsNearExpiry: inventory.itemsNearExpiry.length,
        expiredItems: inventory.expiredItems.length,
      },
      alerts: {
        nearExpiry: inventory.itemsNearExpiry,
        expired: inventory.expiredItems,
        lowQualityFermentables: fermentableReport.filter(
          (f) => !f.isQualityAcceptable,
        ),
        degradedHops: hopReport.filter((h) => !h.isStillFresh),
        lowViabilityYeasts: yeastReport.filter((y) => y.needsStarter),
      },
      reports: {
        fermentables: fermentableReport,
        hops: hopReport,
        yeasts: yeastReport,
      },
    };
  }
}
