import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BaseEntityService } from 'src/database/common/services/base-entity.service';
import { Inventory, InventoryUnit } from './entities/inventory.entity';
import { InventoryInput } from './inputs/inventory.input';
import { User } from 'src/users/entities/user.entity';
import { Hop } from 'src/catalog/entities/hop.entity';
import { Fermentable } from 'src/catalog/entities/fermentable.entity';
import { Yeast } from 'src/catalog/entities/yeast.entity';
import { EntityManager } from '@mikro-orm/core';

interface IngredientRequirement {
  type: 'hop' | 'fermentable' | 'yeast';
  id: string;
  quantity: number;
  unit: InventoryUnit;
}

interface AvailabilityCheck {
  ingredient: IngredientRequirement;
  available: boolean;
  currentStock: number;
  needed: number;
  unit: InventoryUnit;
}

interface ExpiryReport {
  item: Inventory;
  daysUntilExpiry: number;
  expired: boolean;
}

interface CostReport {
  totalInventoryValue: number;
  byCategory: {
    hops: number;
    fermentables: number;
    yeasts: number;
  };
  expiringValue: number;
}

@Injectable()
export class InventoryService extends BaseEntityService<Inventory> {
  constructor(em: EntityManager) {
    super(em, Inventory);
  }

  async addIngredientToInventory(input: InventoryInput): Promise<Inventory> {
    const inventory = this.em.create(Inventory, {
      id: input.id,
      user: await this.em.findOneOrFail(User, { id: input.userId }),
      quantity: input.quantity,
      unit: input.unit,
      purchaseDate: input.purchaseDate,
      bestBeforeDate: input.bestBeforeDate,
      cost: input.cost,
      notes: input.notes,
    });

    if (input.hopId)
      inventory.hop = await this.em.findOneOrFail(Hop, { id: input.hopId });

    if (input.fermentableId)
      inventory.fermentable = await this.em.findOneOrFail(Fermentable, {
        id: input.fermentableId,
      });

    if (input.yeastId)
      inventory.yeast = await this.em.findOneOrFail(Yeast, {
        id: input.yeastId,
      });

    await this.em.persistAndFlush(inventory);

    return inventory;
  }

  /**
   * Atualizar quantidades do inventário
   */
  async updateQuantity(
    inventoryId: string,
    newQuantity: number,
  ): Promise<Inventory> {
    if (newQuantity < 0) {
      throw new BadRequestException('Quantidade não pode ser negativa');
    }

    const inventory = await this.em.findOne(Inventory, { id: inventoryId });
    if (!inventory) {
      throw new NotFoundException('Item do inventário não encontrado');
    }

    inventory.quantity = newQuantity;
    await this.em.persistAndFlush(inventory);

    return inventory;
  }

  /**
   * Consumir ingredientes (reduzir quantidade)
   */
  async consumeIngredient(
    inventoryId: string,
    quantityToConsume: number,
  ): Promise<Inventory> {
    const inventory = await this.em.findOne(Inventory, { id: inventoryId });
    if (!inventory) {
      throw new NotFoundException('Item do inventário não encontrado');
    }

    if (quantityToConsume > inventory.quantity) {
      throw new BadRequestException(
        `Quantidade insuficiente. Disponível: ${inventory.quantity}, Solicitado: ${quantityToConsume}`,
      );
    }

    inventory.quantity -= quantityToConsume;
    await this.em.persistAndFlush(inventory);

    return inventory;
  }

  /**
   * Verificar disponibilidade para receitas
   */
  async checkAvailabilityForRecipe(
    userId: string,
    requirements: IngredientRequirement[],
  ): Promise<AvailabilityCheck[]> {
    const results: AvailabilityCheck[] = [];

    for (const requirement of requirements) {
      const whereClause: any = {
        user: { id: userId },
        [requirement.type]: { id: requirement.id },
      };

      const inventoryItems = await this.em.find(Inventory, whereClause);

      // Somar todas as quantidades do mesmo ingrediente (considerando unidades)
      const totalStock = inventoryItems.reduce((sum, item) => {
        // Aqui você poderia implementar conversão entre unidades se necessário
        if (item.unit === requirement.unit) {
          return sum + item.quantity;
        }
        return sum; // Por agora, apenas soma se as unidades forem iguais
      }, 0);

      results.push({
        ingredient: requirement,
        available: totalStock >= requirement.quantity,
        currentStock: totalStock,
        needed: requirement.quantity,
        unit: requirement.unit,
      });
    }

    return results;
  }

  /**
   * Relatórios de vencimento
   */
  async getExpiryReport(
    userId: string,
    daysAhead: number = 30,
  ): Promise<ExpiryReport[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + daysAhead);

    const inventoryItems = await this.em.find(
      Inventory,
      {
        user: { id: userId },
        bestBeforeDate: { $ne: null },
      },
      { populate: ['hop', 'fermentable', 'yeast'] },
    );

    const today = new Date();
    const reports: ExpiryReport[] = [];

    for (const item of inventoryItems) {
      if (item.bestBeforeDate) {
        const daysUntilExpiry = Math.ceil(
          (item.bestBeforeDate.getTime() - today.getTime()) /
            (1000 * 60 * 60 * 24),
        );

        if (daysUntilExpiry <= daysAhead) {
          reports.push({
            item,
            daysUntilExpiry,
            expired: daysUntilExpiry < 0,
          });
        }
      }
    }

    // Ordenar por proximidade do vencimento
    reports.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);

    return reports;
  }

  /**
   * Obter itens expirados
   */
  async getExpiredItems(userId: string): Promise<Inventory[]> {
    const today = new Date();

    return this.em.find(
      Inventory,
      {
        user: { id: userId },
        bestBeforeDate: { $lt: today },
      },
      { populate: ['hop', 'fermentable', 'yeast'] },
    );
  }

  /**
   * Cálculo de custos
   */
  async getCostReport(userId: string): Promise<CostReport> {
    const inventoryItems = await this.em.find(
      Inventory,
      {
        user: { id: userId },
        cost: { $ne: null },
      },
      { populate: ['hop', 'fermentable', 'yeast'] },
    );

    let totalInventoryValue = 0;
    const byCategory = {
      hops: 0,
      fermentables: 0,
      yeasts: 0,
    };

    // Calcular valor total e por categoria
    for (const item of inventoryItems) {
      const itemValue = (item.cost || 0) * item.quantity;
      totalInventoryValue += itemValue;

      if (item.hop) byCategory.hops += itemValue;
      else if (item.fermentable) byCategory.fermentables += itemValue;
      else if (item.yeast) byCategory.yeasts += itemValue;
    }

    // Calcular valor dos itens que vencem em 30 dias
    const expiringItems = await this.getExpiryReport(userId, 30);
    const expiringValue = expiringItems.reduce((sum, report) => {
      const itemValue = (report.item.cost || 0) * report.item.quantity;
      return sum + itemValue;
    }, 0);

    return {
      totalInventoryValue,
      byCategory,
      expiringValue,
    };
  }

  /**
   * Buscar inventário por usuário
   */
  async getInventoryByUser(userId: string): Promise<Inventory[]> {
    return this.em.find(
      Inventory,
      {
        user: { id: userId },
      },
      { populate: ['hop', 'fermentable', 'yeast'] },
    );
  }

  /**
   * Buscar inventário por tipo de ingrediente
   */
  async getInventoryByIngredientType(
    userId: string,
    type: 'hop' | 'fermentable' | 'yeast',
  ): Promise<Inventory[]> {
    const whereClause: any = {
      user: { id: userId },
      [type]: { $ne: null },
    };

    return this.em.find(Inventory, whereClause, {
      populate: ['hop', 'fermentable', 'yeast'],
    });
  }
}
