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

  async getAllInventoryItems(userId: string) {
    const inventory = await this.getOrCreateUserInventory(userId);

    const [fermentables, hops, yeasts] = await Promise.all([
      this.em.find(
        FermentableInventoryItem,
        { inventory },
        { populate: ['fermentable'] },
      ),
      this.em.find(HopInventoryItem, { inventory }, { populate: ['hop'] }),
      this.em.find(YeastInventoryItem, { inventory }, { populate: ['yeast'] }),
    ]);

    const allItems = [...fermentables, ...hops, ...yeasts];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.serializeInventoryItems(allItems);
  }

  async getAllInventoryItemsPaginated(
    userId: string,
    page: number = 1,
    limit: number = 12,
    type?: InventoryItemType,
    search?: string,
  ) {
    const inventory = await this.getOrCreateUserInventory(userId);
    const offset = (page - 1) * limit;

    let allItems: BaseInventoryItem[] = [];
    let totalCount = 0;

    if (type) {
      const result = await this.getInventoryItemsByTypePaginated(
        inventory.id,
        type,
        offset,
        limit,
        search,
      );
      allItems = result.items;
      totalCount = result.count;
    } else {
      const [fermentableResult, hopResult, yeastResult] = await Promise.all([
        this.em.findAndCount(
          FermentableInventoryItem,
          this.buildSearchFilter(inventory, search, 'fermentable'),
          { populate: ['fermentable'] },
        ),
        this.em.findAndCount(
          HopInventoryItem,
          this.buildSearchFilter(inventory, search, 'hop'),
          { populate: ['hop'] },
        ),
        this.em.findAndCount(
          YeastInventoryItem,
          this.buildSearchFilter(inventory, search, 'yeast'),
          { populate: ['yeast'] },
        ),
      ]);

      const [fermentables, fermentableCount] = fermentableResult;
      const [hops, hopCount] = hopResult;
      const [yeasts, yeastCount] = yeastResult;

      allItems = [...fermentables, ...hops, ...yeasts];
      totalCount = fermentableCount + hopCount + yeastCount;

      allItems = allItems.slice(offset, offset + limit);
    }

    return {
      items: this.serializeInventoryItems(allItems),
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  private async getInventoryItemsByTypePaginated(
    inventoryId: string,
    type: InventoryItemType,
    offset: number,
    limit: number,
    search?: string,
  ) {
    const inventoryRef = this.em.getReference(Inventory, inventoryId);

    switch (type) {
      case InventoryItemType.FERMENTABLE: {
        const [items, count] = await this.em.findAndCount(
          FermentableInventoryItem,
          this.buildSearchFilter(inventoryRef, search, 'fermentable'),
          {
            populate: ['fermentable'],
            limit,
            offset,
            orderBy: { createdAt: 'DESC' },
          },
        );
        return { items, count };
      }

      case InventoryItemType.HOP: {
        const [items, count] = await this.em.findAndCount(
          HopInventoryItem,
          this.buildSearchFilter(inventoryRef, search, 'hop'),
          {
            populate: ['hop'],
            limit,
            offset,
            orderBy: { createdAt: 'DESC' },
          },
        );
        return { items, count };
      }

      case InventoryItemType.YEAST: {
        const [items, count] = await this.em.findAndCount(
          YeastInventoryItem,
          this.buildSearchFilter(inventoryRef, search, 'yeast'),
          {
            populate: ['yeast'],
            limit,
            offset,
            orderBy: { createdAt: 'DESC' },
          },
        );
        return { items, count };
      }

      default:
        return { items: [], count: 0 };
    }
  }

  private buildSearchFilter(
    inventory: Inventory,
    search: string | undefined,
    itemType: 'fermentable' | 'hop' | 'yeast',
  ): Record<string, unknown> {
    const filter: Record<string, unknown> = { inventory };

    if (search) {
      filter[itemType] = { name: { $ilike: `%${search}%` } };
    }

    return filter;
  }

  private serializeInventoryItem(item: BaseInventoryItem) {
    const plain: Record<string, any> = { ...item };

    plain.totalValue = item.totalValue;
    plain.isExpired = item.isExpired;
    plain.isNearExpiry = item.isNearExpiry;
    plain.daysUntilExpiry = item.daysUntilExpiry;

    if (item.type === InventoryItemType.FERMENTABLE) {
      const fermentable = item as FermentableInventoryItem;
      plain.isQualityAcceptable = fermentable.isQualityAcceptable;
      plain.adjustedExtractPotential = fermentable.adjustedExtractPotential;
    }

    if (item.type === InventoryItemType.HOP) {
      const hop = item as HopInventoryItem;
      plain.currentAlphaAcids = hop.currentAlphaAcids;
      plain.isStillFresh = hop.isStillFresh;
    }

    if (item.type === InventoryItemType.YEAST) {
      const yeast = item as YeastInventoryItem;
      plain.currentViability = yeast.currentViability;
      plain.needsStarter = yeast.needsStarter;
      plain.currentCellCount = yeast.currentCellCount;
    }

    return plain;
  }

  private serializeInventoryItems(items: BaseInventoryItem[]): any[] {
    return items.map((item) => this.serializeInventoryItem(item));
  }

  async getInventoryItemsByType<T extends BaseInventoryItem>(
    userId: string,
    type: InventoryItemType,
  ): Promise<T[]> {
    const inventory = await this.getOrCreateUserInventory(userId);

    switch (type) {
      case InventoryItemType.FERMENTABLE:
        return (await this.em.find(
          FermentableInventoryItem,
          { inventory },
          { populate: ['fermentable'] },
        )) as unknown as T[];

      case InventoryItemType.HOP:
        return (await this.em.find(
          HopInventoryItem,
          { inventory },
          { populate: ['hop'] },
        )) as unknown as T[];

      case InventoryItemType.YEAST:
        return (await this.em.find(
          YeastInventoryItem,
          { inventory },
          { populate: ['yeast'] },
        )) as unknown as T[];

      default:
        return [];
    }
  }

  async removeItem(userId: string, itemId: string): Promise<void> {
    const inventory = await this.getOrCreateUserInventory(userId);

    const item =
      (await this.em.findOne(FermentableInventoryItem, {
        id: itemId,
        inventory,
      })) ||
      (await this.em.findOne(HopInventoryItem, { id: itemId, inventory })) ||
      (await this.em.findOne(YeastInventoryItem, { id: itemId, inventory }));

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

    const item =
      (await this.em.findOne(
        FermentableInventoryItem,
        { id: itemId, inventory },
        { populate: ['fermentable'] },
      )) ||
      (await this.em.findOne(
        HopInventoryItem,
        { id: itemId, inventory },
        { populate: ['hop'] },
      )) ||
      (await this.em.findOne(
        YeastInventoryItem,
        { id: itemId, inventory },
        { populate: ['yeast'] },
      ));

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

    const item =
      (await this.em.findOne(
        FermentableInventoryItem,
        { id: itemId, inventory },
        { populate: ['fermentable'] },
      )) ||
      (await this.em.findOne(
        HopInventoryItem,
        { id: itemId, inventory },
        { populate: ['hop'] },
      )) ||
      (await this.em.findOne(
        YeastInventoryItem,
        { id: itemId, inventory },
        { populate: ['yeast'] },
      ));

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
