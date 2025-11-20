import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import {
  BaseInventoryItem,
  InventoryItemType,
} from '../entities/base-inventory-item.entity';
import { FermentableInventoryItem } from '../entities/fermentable-inventory-item.entity';
import { HopInventoryItem } from '../entities/hop-inventory-item.entity';
import { YeastInventoryItem } from '../entities/yeast-inventory-item.entity';
import { BaseEntityService } from 'src/database/common/services/base-entity.service';
import { inventoryItemResolver } from '../resolvers/inventory-item.resolver';
import { BaseInventoryItemInputUnion } from '../inputs/base-inventory-item.input';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class InventoryItemService extends BaseEntityService<BaseInventoryItem> {
  constructor(em: EntityManager) {
    super(em, BaseInventoryItem, inventoryItemResolver);
  }

  override async save(
    data: BaseInventoryItemInputUnion,
  ): Promise<BaseInventoryItem> {
    return await super.save(data);
  }

  override async findById(id: string): Promise<BaseInventoryItem | null> {
    // Busca em todas as entidades concretas
    const item =
      (await this.em.findOne(FermentableInventoryItem, { id })) ||
      (await this.em.findOne(HopInventoryItem, { id })) ||
      (await this.em.findOne(YeastInventoryItem, { id }));

    return item;
  }

  override async findByIdOrFail(id: string): Promise<BaseInventoryItem> {
    const item = await this.findById(id);
    if (!item) {
      throw new BadRequestException('Inventory item not found');
    }
    return item;
  }

  async findAll(): Promise<BaseInventoryItem[]> {
    const [fermentables, hops, yeasts] = await Promise.all([
      this.em.find(FermentableInventoryItem, {}),
      this.em.find(HopInventoryItem, {}),
      this.em.find(YeastInventoryItem, {}),
    ]);

    return [...fermentables, ...hops, ...yeasts];
  }

  async findByInventory(inventoryId: string): Promise<BaseInventoryItem[]> {
    const [fermentables, hops, yeasts] = await Promise.all([
      this.em.find(FermentableInventoryItem, { inventory: inventoryId }),
      this.em.find(HopInventoryItem, { inventory: inventoryId }),
      this.em.find(YeastInventoryItem, { inventory: inventoryId }),
    ]);

    return [...fermentables, ...hops, ...yeasts];
  }

  async findByType<T extends BaseInventoryItem>(
    type: InventoryItemType,
  ): Promise<T[]> {
    switch (type) {
      case InventoryItemType.FERMENTABLE:
        return (await this.em.find(
          FermentableInventoryItem,
          {},
        )) as unknown as T[];
      case InventoryItemType.HOP:
        return (await this.em.find(HopInventoryItem, {})) as unknown as T[];
      case InventoryItemType.YEAST:
        return (await this.em.find(YeastInventoryItem, {})) as unknown as T[];
      default:
        return [];
    }
  }
}
