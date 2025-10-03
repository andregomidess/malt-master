import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import {
  BaseInventoryItem,
  InventoryItemType,
} from '../entities/base-inventory-item.entity';
import { BaseEntityService } from 'src/database/common/services/base-entity.service';
import { inventoryItemResolver } from '../resolvers/inventory-item.resolver';
import { BaseInventoryItemInputUnion } from '../inputs/base-inventory-item.input';

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

  async findAll(): Promise<BaseInventoryItem[]> {
    return await this.em.find(BaseInventoryItem, {});
  }

  async findByInventory(inventoryId: string): Promise<BaseInventoryItem[]> {
    return await this.em.find(BaseInventoryItem, { inventory: inventoryId });
  }

  async findByType<T extends BaseInventoryItem>(
    type: InventoryItemType,
  ): Promise<T[]> {
    return (await this.em.find(BaseInventoryItem, { type })) as T[];
  }
}
