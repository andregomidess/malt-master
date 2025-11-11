import { IsOptional, IsEnum, IsString } from 'class-validator';
import { PaginationSearchableQuery } from 'src/database/common/queries/pagination.query';
import { InventoryItemType } from '../entities/base-inventory-item.entity';

export class InventoryPaginationQuery extends PaginationSearchableQuery {
  @IsOptional()
  @IsEnum(InventoryItemType)
  type?: InventoryItemType;

  @IsOptional()
  @IsString()
  sortBy?: 'name' | 'quantity' | 'createdAt' | 'bestBeforeDate' = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
