import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Inventory } from '../entities/inventory.entity';
import {
  BaseInventoryItem,
  InventoryItemType,
} from '../entities/base-inventory-item.entity';
import { FermentableInventoryItem } from '../entities/fermentable-inventory-item.entity';
import { HopInventoryItem } from '../entities/hop-inventory-item.entity';
import { YeastInventoryItem } from '../entities/yeast-inventory-item.entity';
import { BaseEntityService } from 'src/database/common/services/base-entity.service';
import { InventoryItemService } from './inventory-item.service';
import { BaseInventoryItemInputUnion } from '../inputs/base-inventory-item.input';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class InventoryService extends BaseEntityService<Inventory> {
  constructor(
    em: EntityManager,
    private readonly inventoryItemService: InventoryItemService,
  ) {
    super(em, Inventory);
  }

  async getOrCreateUserInventory(userId: string): Promise<Inventory> {
    let inventory = await this.em.findOne(Inventory, { user: userId });

    if (!inventory) {
      inventory = this.em.create(Inventory, {
        user: this.em.getReference(User, userId),
      });
      await this.em.persistAndFlush(inventory);
    }

    return inventory;
  }

  async getUserInventory(userId: string): Promise<Inventory> {
    return await this.getOrCreateUserInventory(userId);
  }

  async getUserInventoryWithItems(userId: string) {
    const inventory = await this.getOrCreateUserInventory(userId);
    return await this.em.findOneOrFail(
      Inventory,
      { id: inventory.id },
      {
        populate: ['fermentableItems', 'hopItems', 'yeastItems', 'user'],
      },
    );
  }

  async addInventoryItem(
    userId: string,
    itemData: BaseInventoryItemInputUnion,
  ): Promise<BaseInventoryItem> {
    const inventory = await this.getOrCreateUserInventory(userId);

    return await this.inventoryItemService.save({
      ...itemData,
      inventory,
    });
  }

  async getAllInventoryItems(userId: string): Promise<BaseInventoryItem[]> {
    const inventory = await this.getOrCreateUserInventory(userId);
    return await this.em.find(BaseInventoryItem, { inventory });
  }

  async getInventoryItemsByType<T extends BaseInventoryItem>(
    userId: string,
    type: InventoryItemType,
  ): Promise<T[]> {
    const inventory = await this.getOrCreateUserInventory(userId);
    return (await this.em.find(BaseInventoryItem, {
      inventory,
      type,
    })) as T[];
  }

  async removeItem(userId: string, itemId: string): Promise<void> {
    const inventory = await this.getOrCreateUserInventory(userId);
    const item = await this.em.findOne(BaseInventoryItem, {
      id: itemId,
      inventory,
    });

    if (item) {
      await this.em.removeAndFlush(item);
    }
  }

  async updateItemQuantity(
    userId: string,
    itemId: string,
    newQuantity: number,
  ): Promise<BaseInventoryItem | null> {
    const inventory = await this.getOrCreateUserInventory(userId);
    const item = await this.em.findOne(BaseInventoryItem, {
      id: itemId,
      inventory,
    });

    if (item) {
      item.quantity = newQuantity;
      await this.em.persistAndFlush(item);
      return item;
    }

    return null;
  }

  async updateInventoryItem(
    userId: string,
    itemId: string,
    updateData: Partial<BaseInventoryItemInputUnion>,
  ): Promise<BaseInventoryItem | null> {
    const inventory = await this.getOrCreateUserInventory(userId);
    const item = await this.em.findOne(BaseInventoryItem, {
      id: itemId,
      inventory,
    });

    if (item) {
      this.em.assign(item, updateData);
      await this.em.persistAndFlush(item);
      return item;
    }

    return null;
  }

  async getInventoryStats(userId: string) {
    const inventory = await this.getUserInventoryWithItems(userId);

    return {
      totalValue: inventory.totalValue,
      totalItems: inventory.totalItems,
      itemsNearExpiry: inventory.itemsNearExpiry.length,
      expiredItems: inventory.expiredItems.length,
      fermentableCount: inventory.fermentableItems.length,
      hopCount: inventory.hopItems.length,
      yeastCount: inventory.yeastItems.length,
    };
  }

  async searchInventoryItems(
    userId: string,
    searchTerm: string,
  ): Promise<BaseInventoryItem[]> {
    const inventory = await this.getOrCreateUserInventory(userId);

    const [fermentables, hops, yeasts] = await Promise.all([
      this.em.find(
        FermentableInventoryItem,
        {
          inventory,
          fermentable: { name: { $ilike: `%${searchTerm}%` } },
        },
        { populate: ['fermentable'] },
      ),

      this.em.find(
        HopInventoryItem,
        {
          inventory,
          hop: { name: { $ilike: `%${searchTerm}%` } },
        },
        { populate: ['hop'] },
      ),

      this.em.find(
        YeastInventoryItem,
        {
          inventory,
          yeast: { name: { $ilike: `%${searchTerm}%` } },
        },
        { populate: ['yeast'] },
      ),
    ]);

    return [...fermentables, ...hops, ...yeasts];
  }
}
