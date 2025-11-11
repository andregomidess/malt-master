import { IsOptional, IsEnum } from 'class-validator';
import { PaginationSearchableQuery } from 'src/database/common/queries/pagination.query';
import { EquipmentType } from '../entities/equipment.entity';

export enum EquipmentSortBy {
  NAME = 'name',
  CAPACITY = 'totalCapacity',
  CREATED_AT = 'createdAt',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class EquipmentQueryInput extends PaginationSearchableQuery {
  @IsOptional()
  @IsEnum(EquipmentType)
  type?: EquipmentType;

  @IsOptional()
  @IsEnum(EquipmentSortBy)
  sortBy?: EquipmentSortBy;

  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder;
}
