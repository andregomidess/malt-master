import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { InventoryService } from './services/inventory.service';
import { InventoryController } from './controllers/inventory.controller';
import { InventoryItemController } from './controllers/inventory-item.controller';
import { InventoryItemService } from './services/inventory-item.service';
import { Inventory } from './entities/inventory.entity';
import { FermentableInventoryItem } from './entities/fermentable-inventory-item.entity';
import { HopInventoryItem } from './entities/hop-inventory-item.entity';
import { YeastInventoryItem } from './entities/yeast-inventory-item.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Inventory,
      FermentableInventoryItem,
      HopInventoryItem,
      YeastInventoryItem,
    ]),
  ],
  controllers: [InventoryController, InventoryItemController],
  providers: [InventoryService, InventoryItemService],
  exports: [InventoryService, InventoryItemService],
})
export class InventoryModule {}
