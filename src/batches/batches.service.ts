import { Injectable } from '@nestjs/common';
import {
  EntityManager,
  FilterQuery,
  QueryOrder,
  QueryOrderMap,
} from '@mikro-orm/core';
import { BaseEntityService } from 'src/database/common/services/base-entity.service';
import { Batch } from './entities/batch.entity';
import { BatchInput } from './inputs/batch.input';
import { BatchQueryInput, BatchSortBy, SortOrder } from './queries/batch.query';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

@Injectable()
export class BatchesService extends BaseEntityService<Batch> {
  constructor(protected override readonly em: EntityManager) {
    super(em, Batch);
  }

  async findAllPaginatedByUser(
    userId: string,
    query: BatchQueryInput,
  ): Promise<PaginatedResult<Batch>> {
    const where: FilterQuery<Batch> = {
      user: { id: userId },
    };

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where.$or = [
        { name: { $ilike: `%${query.search}%` } },
        { batchCode: { $ilike: `%${query.search}%` } },
        { observations: { $ilike: `%${query.search}%` } },
        { recipe: { name: { $ilike: `%${query.search}%` } } },
      ];
    }

    const sortField = query.sortBy || BatchSortBy.BREW_DATE;
    const sortOrder =
      query.order === SortOrder.ASC ? QueryOrder.ASC : QueryOrder.DESC;

    const orderBy: QueryOrderMap<Batch> = {
      [sortField]: sortOrder,
    } as QueryOrderMap<Batch>;

    const [data, total] = await this.em.findAndCount(Batch, where, {
      orderBy,
      limit: query.limit,
      offset: query.offset,
      populate: ['recipe', 'recipe.beerStyle', 'equipment'],
    });

    return {
      data,
      total,
      page: query.page,
      totalPages: Math.ceil(total / query.take),
    };
  }

  async findAllByUser(userId: string): Promise<Batch[]> {
    return await this.em.find(
      Batch,
      { user: { id: userId } },
      {
        orderBy: { brewDate: 'desc' },
        populate: ['recipe', 'recipe.beerStyle', 'equipment'],
      },
    );
  }

  async upsertBatch(input: BatchInput): Promise<Batch> {
    const saved = await this.save(input);
    // Recarregar com todos os relacionamentos populados
    await this.em.populate(saved, [
      'recipe',
      'recipe.beerStyle',
      'equipment',
      'user',
    ]);
    return saved;
  }

  async deleteBatch(userId: string, batchId: string): Promise<void> {
    const batch = await this.em.findOneOrFail(Batch, {
      id: batchId,
      user: userId,
    });

    await this.em.removeAndFlush(batch);
  }
}
