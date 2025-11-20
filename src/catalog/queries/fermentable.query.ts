import { IsOptional, IsEnum } from 'class-validator';
import { PaginationSearchableQuery } from 'src/database/common/queries/pagination.query';

export enum FermentableSortBy {
  NAME = 'name',
  COLOR = 'color',
  YIELD = 'yield',
  CREATED_AT = 'createdAt',
  TYPE = 'type',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class FermentableQueryInput extends PaginationSearchableQuery {
  @IsOptional()
  @IsEnum(FermentableSortBy)
  sortBy?: FermentableSortBy;

  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder;
}
