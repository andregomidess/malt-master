import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { BatchesService } from './batches.service';
import { BatchInput } from './inputs/batch.input';
import { Batch } from './entities/batch.entity';
import { BatchQueryInput } from './queries/batch.query';
import { PaginatedResult } from './batches.service';

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('batches')
@UseGuards(JwtAuthGuard)
export class BatchesController {
  constructor(
    private readonly batchesService: BatchesService,
    private readonly em: EntityManager,
  ) {}

  @Get()
  async list(
    @Request() req: AuthenticatedRequest,
    @Query() query: BatchQueryInput,
  ): Promise<PaginatedResult<Batch> | Batch[]> {
    if (query.page && query.take) {
      return await this.batchesService.findAllPaginatedByUser(
        req.user.id,
        query,
      );
    }
    return await this.batchesService.findAllByUser(req.user.id);
  }

  @Get(':id')
  async getOne(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return await this.em.findOneOrFail(
      Batch,
      { id, user: req.user.id },
      {
        populate: [
          'recipe',
          'equipment',
          'user',
          'recipe.mash',
          'recipe.mash.mashProfile',
          'recipe.mash.mashProfile.steps',
          'recipe.fermentation',
          'recipe.fermentation.fermentationProfile',
          'recipe.fermentation.fermentationProfile.steps',
          'recipe.hops',
        ],
      },
    );
  }

  @Put()
  async upsert(@Body() input: BatchInput) {
    return await this.batchesService.upsertBatch(input);
  }

  @Delete(':id')
  async remove(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    await this.batchesService.deleteBatch(req.user.id, id);
    return { message: 'Batch removed successfully' };
  }
}
