import {
  EntityManager,
  QueryOrder,
  type FilterQuery,
  type QueryOrderMap,
} from '@mikro-orm/postgresql';
import { Hop } from '../entities/hop.entity';
import { BaseEntityService } from 'src/database/common/services/base-entity.service';
import { Injectable } from '@nestjs/common';
import { HopQueryInput, HopSortBy, SortOrder } from '../queries/hop.query';
import { User } from 'src/users/entities/user.entity';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

@Injectable()
export class HopService extends BaseEntityService<Hop> {
  constructor(em: EntityManager) {
    super(em, Hop);
  }

  async findAll(user: User): Promise<Hop[]> {
    return await this.em.find(Hop, {
      $or: [{ user }, { user: null }],
    });
  }

  async findAllPaginated(
    query: HopQueryInput,
    user: User,
  ): Promise<PaginatedResult<Hop>> {
    const where: FilterQuery<Hop> = {};

    if (query.search) {
      where.$and = [
        {
          $or: [{ user }, { user: null }],
        },
        {
          $or: [
            { name: { $ilike: `%${query.search}%` } },
            { origin: { $ilike: `%${query.search}%` } },
            { aromaFlavor: { $ilike: `%${query.search}%` } },
            { supplier: { $ilike: `%${query.search}%` } },
          ],
        },
      ];
    } else {
      where.$or = [{ user }, { user: null }];
    }

    const sortField = query.sortBy || HopSortBy.NAME;
    const sortOrder =
      query.order === SortOrder.ASC ? QueryOrder.ASC : QueryOrder.DESC;

    const orderBy: QueryOrderMap<Hop> = {
      [sortField]: sortOrder,
    } as QueryOrderMap<Hop>;

    const [data, total] = await this.em.findAndCount(Hop, where, {
      orderBy,
      limit: query.limit,
      offset: query.offset,
    });

    return {
      data,
      total,
      page: query.page,
      totalPages: Math.ceil(total / query.take),
    };
  }
}
