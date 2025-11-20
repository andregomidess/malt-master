import {
  EntityManager,
  QueryOrder,
  type FilterQuery,
  type QueryOrderMap,
} from '@mikro-orm/postgresql';
import { BaseEntityService } from 'src/database/common/services/base-entity.service';
import { Yeast } from '../entities/yeast.entity';
import { Injectable } from '@nestjs/common';
import {
  YeastQueryInput,
  YeastSortBy,
  SortOrder,
} from '../queries/yeast.query';
import { User } from 'src/users/entities/user.entity';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

@Injectable()
export class YeastService extends BaseEntityService<Yeast> {
  constructor(em: EntityManager) {
    super(em, Yeast);
  }

  async findAll(user: User): Promise<Yeast[]> {
    return await this.em.find(Yeast, {
      $or: [{ user }, { user: null }],
    });
  }

  async findAllPaginated(
    query: YeastQueryInput,
    user: User,
  ): Promise<PaginatedResult<Yeast>> {
    const where: FilterQuery<Yeast> = {};

    if (query.search) {
      where.$and = [
        {
          $or: [{ user }, { user: null }],
        },
        {
          $or: [
            { name: { $ilike: `%${query.search}%` } },
            { origin: { $ilike: `%${query.search}%` } },
            { supplier: { $ilike: `%${query.search}%` } },
            { aromaFlavor: { $ilike: `%${query.search}%` } },
            { notes: { $ilike: `%${query.search}%` } },
          ],
        },
      ];
    } else {
      where.$or = [{ user }, { user: null }];
    }

    const sortField = query.sortBy || YeastSortBy.NAME;
    const sortOrder =
      query.order === SortOrder.ASC ? QueryOrder.ASC : QueryOrder.DESC;

    const orderBy: QueryOrderMap<Yeast> = {
      [sortField]: sortOrder,
    } as QueryOrderMap<Yeast>;

    const [data, total] = await this.em.findAndCount(Yeast, where, {
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
