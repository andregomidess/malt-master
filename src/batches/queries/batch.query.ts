import { IsOptional, IsEnum } from 'class-validator';
import { PaginationSearchableQuery } from 'src/database/common/queries/pagination.query';
import { BatchStatus } from '../entities/batch.entity';

export enum BatchSortBy {
  NAME = 'name',
  BREW_DATE = 'brewDate',
  STATUS = 'status',
  CREATED_AT = 'createdAt',
  PACKAGING_DATE = 'packagingDate',
  READY_DATE = 'readyDate',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class BatchQueryInput extends PaginationSearchableQuery {
  @IsOptional()
  @IsEnum(BatchStatus)
  status?: BatchStatus;

  @IsOptional()
  @IsEnum(BatchSortBy)
  sortBy?: BatchSortBy;

  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder;
}
