import { IsOptional, IsEnum } from 'class-validator';
import { PaginationSearchableQuery } from 'src/database/common/queries/pagination.query';

export enum BeerStyleSortBy {
  NAME = 'name',
  CREATED_AT = 'createdAt',
  CATEGORY = 'category',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class BeerStyleQueryInput extends PaginationSearchableQuery {
  @IsOptional()
  @IsEnum(BeerStyleSortBy)
  sortBy?: BeerStyleSortBy;

  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder;
}
