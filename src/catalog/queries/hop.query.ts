import { IsOptional, IsEnum } from 'class-validator';
import { PaginationSearchableQuery } from 'src/database/common/queries/pagination.query';

export enum HopSortBy {
  NAME = 'name',
  ALPHA_ACIDS = 'alphaAcids',
  CREATED_AT = 'createdAt',
  COST = 'costPerKilogram',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class HopQueryInput extends PaginationSearchableQuery {
  @IsOptional()
  @IsEnum(HopSortBy)
  sortBy?: HopSortBy;

  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder;
}
