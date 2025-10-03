import { EntityClass } from '@mikro-orm/core';
import {
  BaseInventoryItem,
  InventoryItemType,
} from '../entities/base-inventory-item.entity';
import { FermentableInventoryItem } from '../entities/fermentable-inventory-item.entity';
import { HopInventoryItem } from '../entities/hop-inventory-item.entity';
import { YeastInventoryItem } from '../entities/yeast-inventory-item.entity';

export const inventoryItemResolver = (
  data: Partial<BaseInventoryItem>,
): EntityClass<BaseInventoryItem> => {
  switch (data.type) {
    case InventoryItemType.FERMENTABLE:
      return FermentableInventoryItem as EntityClass<BaseInventoryItem>;

    case InventoryItemType.HOP:
      return HopInventoryItem as EntityClass<BaseInventoryItem>;

    case InventoryItemType.YEAST:
      return YeastInventoryItem as EntityClass<BaseInventoryItem>;

    default:
      return BaseInventoryItem as EntityClass<BaseInventoryItem>;
  }
};
