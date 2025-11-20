import {
  EntityManager,
  QueryOrder,
  type FilterQuery,
  type QueryOrderMap,
} from '@mikro-orm/postgresql';
import { BaseEntityService } from '../../database/common/services/base-entity.service';
import { BeerStyle } from '../entities/beer-style.entity';
import { Injectable } from '@nestjs/common';
import {
  BeerStyleQueryInput,
  BeerStyleSortBy,
  SortOrder,
} from '../queries/beer-style.query';
import { User } from 'src/users/entities/user.entity';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

@Injectable()
export class BeerStyleService extends BaseEntityService<BeerStyle> {
  constructor(em: EntityManager) {
    super(em, BeerStyle);
  }

  async findAll(user: User): Promise<BeerStyle[]> {
    return await this.em.find(BeerStyle, {
      $or: [{ user }, { user: null }],
    });
  }

  async findAllPaginated(
    query: BeerStyleQueryInput,
    user: User,
  ): Promise<PaginatedResult<BeerStyle>> {
    const where: FilterQuery<BeerStyle> = {};

    if (query.search) {
      where.$and = [
        {
          $or: [{ user }, { user: null }],
        },
        {
          $or: [
            { name: { $ilike: `%${query.search}%` } },
            { category: { $ilike: `%${query.search}%` } },
            { subCategory: { $ilike: `%${query.search}%` } },
            { description: { $ilike: `%${query.search}%` } },
          ],
        },
      ];
    } else {
      where.$or = [{ user }, { user: null }];
    }

    const sortField = query.sortBy || BeerStyleSortBy.NAME;
    const sortOrder =
      query.order === SortOrder.ASC ? QueryOrder.ASC : QueryOrder.DESC;

    const orderBy: QueryOrderMap<BeerStyle> = {
      [sortField]: sortOrder,
    } as QueryOrderMap<BeerStyle>;

    const [data, total] = await this.em.findAndCount(BeerStyle, where, {
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
