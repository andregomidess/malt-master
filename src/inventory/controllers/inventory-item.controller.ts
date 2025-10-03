import {
  Body,
  Controller,
  Get,
  Put,
  Patch,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { InventoryItemService } from '../services/inventory-item.service';
import { type BaseInventoryItemInputUnion } from '../inputs/base-inventory-item.input';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { InventoryItemType } from '../entities/base-inventory-item.entity';
import { type FermentableInventoryItem } from '../entities/fermentable-inventory-item.entity';
import { type HopInventoryItem } from '../entities/hop-inventory-item.entity';
import { type YeastInventoryItem } from '../entities/yeast-inventory-item.entity';

@Controller('inventory-items')
@UseGuards(JwtAuthGuard)
export class InventoryItemController {
  constructor(private readonly inventoryItemService: InventoryItemService) {}

  @Get()
  async findAll() {
    return await this.inventoryItemService.findAll();
  }

  @Put()
  async saveInventoryItem(@Body() itemInput: BaseInventoryItemInputUnion) {
    return await this.inventoryItemService.save(itemInput);
  }

  @Get('fermentables')
  async findFermentables(): Promise<FermentableInventoryItem[]> {
    return await this.inventoryItemService.findByType<FermentableInventoryItem>(
      InventoryItemType.FERMENTABLE,
    );
  }

  @Get('hops')
  async findHops(): Promise<HopInventoryItem[]> {
    return await this.inventoryItemService.findByType<HopInventoryItem>(
      InventoryItemType.HOP,
    );
  }

  @Get('yeasts')
  async findYeasts(): Promise<YeastInventoryItem[]> {
    return await this.inventoryItemService.findByType<YeastInventoryItem>(
      InventoryItemType.YEAST,
    );
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.inventoryItemService.findById(id);
  }

  @Get('inventory/:inventoryId')
  async findByInventory(@Param('inventoryId') inventoryId: string) {
    return await this.inventoryItemService.findByInventory(inventoryId);
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    return await this.inventoryItemService.softDelete(id);
  }

  @Patch(':id/recovery')
  async recoveryInventoryItem(@Param('id') id: string) {
    return await this.inventoryItemService.recovery(id);
  }
}
