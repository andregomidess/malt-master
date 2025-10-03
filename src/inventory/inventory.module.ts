import { Module } from '@nestjs/common';
import { InventoryService } from './services/inventory.service';
import { InventoryController } from './controllers/inventory.controller';
import { InventoryItemController } from './controllers/inventory-item.controller';
import { InventoryAnalyticsService } from './services/inventory-analytics.service';
import { InventoryItemService } from './services/inventory-item.service';

@Module({
  controllers: [InventoryController, InventoryItemController],
  providers: [
    InventoryService,
    InventoryItemService,
    InventoryAnalyticsService,
  ],
  exports: [InventoryService, InventoryItemService],
})
export class InventoryModule {}
