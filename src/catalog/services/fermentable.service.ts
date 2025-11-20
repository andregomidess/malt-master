import {
  EntityManager,
  QueryOrder,
  type FilterQuery,
  type QueryOrderMap,
} from '@mikro-orm/postgresql';
import { BaseEntityService } from 'src/database/common/services/base-entity.service';
import { Fermentable } from '../entities/fermentable.entity';
import { Injectable } from '@nestjs/common';
import {
  FermentableQueryInput,
  FermentableSortBy,
  SortOrder,
} from '../queries/fermentable.query';
import { User } from 'src/users/entities/user.entity';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

@Injectable()
export class FermentableService extends BaseEntityService<Fermentable> {
  constructor(em: EntityManager) {
    super(em, Fermentable);
  }

  async findAll(user: User): Promise<Fermentable[]> {
    return await this.em.find(Fermentable, {
      $or: [{ user }, { user: null }],
    });
  }

  async findAllPaginated(
    query: FermentableQueryInput,
    user: User,
  ): Promise<PaginatedResult<Fermentable>> {
    const where: FilterQuery<Fermentable> = {};

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
            { notes: { $ilike: `%${query.search}%` } },
          ],
        },
      ];
    } else {
      where.$or = [{ user }, { user: null }];
    }

    const sortField = query.sortBy || FermentableSortBy.NAME;
    const sortOrder =
      query.order === SortOrder.ASC ? QueryOrder.ASC : QueryOrder.DESC;

    const orderBy: QueryOrderMap<Fermentable> = {
      [sortField]: sortOrder,
    } as QueryOrderMap<Fermentable>;

    const [data, total] = await this.em.findAndCount(Fermentable, where, {
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
