import { IsOptional, IsEnum } from 'class-validator';
import { PaginationSearchableQuery } from 'src/database/common/queries/pagination.query';

export enum YeastSortBy {
  NAME = 'name',
  ATTENUATION = 'attenuation',
  TYPE = 'type',
  CREATED_AT = 'createdAt',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class YeastQueryInput extends PaginationSearchableQuery {
  @IsOptional()
  @IsEnum(YeastSortBy)
  sortBy?: YeastSortBy;

  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder;
}
