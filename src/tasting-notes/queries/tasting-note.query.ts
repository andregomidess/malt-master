import { IsOptional, IsEnum, IsUUID } from 'class-validator';
import { PaginationSearchableQuery } from 'src/database/common/queries/pagination.query';

export enum TastingNoteSortBy {
  TASTING_DATE = 'tastingDate',
  OVERALL_SCORE = 'overallScore',
  CREATED_AT = 'createdAt',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class TastingNoteQueryInput extends PaginationSearchableQuery {
  @IsOptional()
  @IsUUID()
  batchId?: string;

  @IsOptional()
  @IsEnum(TastingNoteSortBy)
  sortBy?: TastingNoteSortBy;

  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder;
}
