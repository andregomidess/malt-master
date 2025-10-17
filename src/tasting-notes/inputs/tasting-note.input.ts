import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Batch } from 'src/batches/entities/batch.entity';
import { IsEntity } from 'src/database/common/decorators/transform-if-entity-exists.decorator';
import { PrimaryKeyUUID } from 'src/database/common/helpers/PrimaryKeyUUID';

export class TastingNoteInput {
  @PrimaryKeyUUID()
  id!: string;

  @IsEntity({ entity: Batch })
  batch!: Batch;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  tastingDate?: Date;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(10)
  appearanceScore?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(10)
  aromaScore?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(10)
  flavorScore?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(10)
  mouthfeelScore?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(10)
  overallScore!: number;

  @IsString()
  @IsOptional()
  pros?: string;

  @IsString()
  @IsOptional()
  cons?: string;

  @IsString()
  @IsOptional()
  generalNotes?: string;
}
