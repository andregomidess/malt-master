import { IsInt, Min, Max, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQuery {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  take: number = 10;

  get offset(): number {
    return (this.page - 1) * this.take;
  }

  get limit(): number {
    return this.take;
  }
}

export class PaginationSearchableQuery extends PaginationQuery {
  @IsOptional()
  @IsString()
  search?: string;
}
