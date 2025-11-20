import { IsOptional, IsEnum } from 'class-validator';
import { PaginationSearchableQuery } from 'src/database/common/queries/pagination.query';

export enum WaterProfileSortBy {
  NAME = 'name',
  CA = 'ca',
  SO4 = 'so4',
  CL = 'cl',
  CREATED_AT = 'createdAt',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class WaterProfileQueryInput extends PaginationSearchableQuery {
  @IsOptional()
  @IsEnum(WaterProfileSortBy)
  sortBy?: WaterProfileSortBy;

  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder;
}
