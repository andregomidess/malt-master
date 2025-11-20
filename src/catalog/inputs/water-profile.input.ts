import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { IsEntity } from 'src/database/common/decorators/transform-if-entity-exists.decorator';
import { User } from 'src/users/entities/user.entity';

export class WaterProfileInput {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsEntity({ entity: User })
  @IsOptional()
  @IsUUID()
  user?: User;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  origin?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ca?: number;

  @IsOptional()
  @IsNumber()
  mg?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  na?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  so4?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  cl?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  hco3?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ph?: number;

  @IsOptional()
  @IsString()
  recommendedStyle?: string | null;

  @IsOptional()
  @IsString()
  notes?: string | null;
}
