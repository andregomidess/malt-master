import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { InventoryService } from '../services/inventory.service';
import { type BaseInventoryItemInputUnion } from '../inputs/base-inventory-item.input';
import { InventoryPaginationQuery } from '../queries/inventory.query';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { InventoryItemType } from '../entities/base-inventory-item.entity';

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  async getUserInventory(@Request() req: AuthenticatedRequest) {
    return await this.inventoryService.getUserInventoryWithItems(req.user.id);
  }

  @Get('stats')
  async getInventoryStats(@Request() req: AuthenticatedRequest) {
    return await this.inventoryService.getInventoryStats(req.user.id);
  }

  @Get('search')
  async searchInventoryItems(
    @Request() req: AuthenticatedRequest,
    @Query('search') searchTerm: string,
  ) {
    return await this.inventoryService.searchInventoryItems(
      req.user.id,
      searchTerm,
    );
  }

  @Get('items')
  async getAllInventoryItems(
    @Request() req: AuthenticatedRequest,
    @Query() query: InventoryPaginationQuery,
  ) {
    if (query.page && query.take) {
      return await this.inventoryService.getAllInventoryItemsPaginated(
        req.user.id,
        query.page,
        query.take,
        query.type,
        query.search,
      );
    }

    return await this.inventoryService.getAllInventoryItems(req.user.id);
  }

  @Get('items/type/:type')
  async getInventoryItemsByType(
    @Request() req: AuthenticatedRequest,
    @Param('type') type: InventoryItemType,
  ) {
    return await this.inventoryService.getInventoryItemsByType(
      req.user.id,
      type,
    );
  }

  @Get('items/expiring')
  async getExpiringItems(@Request() req: AuthenticatedRequest) {
    const inventory = await this.inventoryService.getUserInventoryWithItems(
      req.user.id,
    );
    return inventory.itemsNearExpiry;
  }

  @Get('items/expired')
  async getExpiredItems(@Request() req: AuthenticatedRequest) {
    const inventory = await this.inventoryService.getUserInventoryWithItems(
      req.user.id,
    );
    return inventory.expiredItems;
  }

  @Post('items')
  async addInventoryItem(
    @Request() req: AuthenticatedRequest,
    @Body() itemData: BaseInventoryItemInputUnion,
  ) {
    return await this.inventoryService.addInventoryItem(req.user.id, itemData);
  }

  @Patch('items/:id')
  async updateInventoryItem(
    @Request() req: AuthenticatedRequest,
    @Param('id') itemId: string,
    @Body() updateData: Partial<BaseInventoryItemInputUnion>,
  ) {
    return await this.inventoryService.updateInventoryItem(
      req.user.id,
      itemId,
      updateData,
    );
  }

  @Patch('items/:id/quantity')
  async updateItemQuantity(
    @Request() req: AuthenticatedRequest,
    @Param('id') itemId: string,
    @Body('quantity') newQuantity: number,
  ) {
    return await this.inventoryService.updateItemQuantity(
      req.user.id,
      itemId,
      newQuantity,
    );
  }

  @Delete('items/:id')
  async removeInventoryItem(
    @Request() req: AuthenticatedRequest,
    @Param('id') itemId: string,
  ) {
    await this.inventoryService.removeItem(req.user.id, itemId);
    return { message: 'Item removed successfully' };
  }
}
