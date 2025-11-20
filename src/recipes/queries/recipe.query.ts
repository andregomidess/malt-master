import { IsOptional, IsEnum } from 'class-validator';
import { PaginationSearchableQuery } from 'src/database/common/queries/pagination.query';
import { RecipeType } from '../entities/recipe.entity';

export enum RecipeSortBy {
  NAME = 'name',
  CREATED_AT = 'createdAt',
  BREW_DATE = 'brewDate',
  ESTIMATED_ABV = 'estimatedAbv',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class RecipeQueryInput extends PaginationSearchableQuery {
  @IsOptional()
  @IsEnum(RecipeType)
  type?: RecipeType;

  @IsOptional()
  @IsEnum(RecipeSortBy)
  sortBy?: RecipeSortBy;

  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder;
}
