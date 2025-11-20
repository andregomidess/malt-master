import {
  EntityManager,
  QueryOrder,
  type FilterQuery,
  type QueryOrderMap,
} from '@mikro-orm/postgresql';
import { BaseEntityService } from 'src/database/common/services/base-entity.service';
import { WaterProfile } from '../entities/water-profile.entity';
import { Injectable } from '@nestjs/common';
import {
  WaterProfileQueryInput,
  WaterProfileSortBy,
  SortOrder,
} from '../queries/water-profile.query';
import { User } from 'src/users/entities/user.entity';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

@Injectable()
export class WaterProfileService extends BaseEntityService<WaterProfile> {
  constructor(em: EntityManager) {
    super(em, WaterProfile);
  }

  async findAll(user: User): Promise<WaterProfile[]> {
    return await this.em.find(WaterProfile, {
      $or: [{ user }, { user: null }],
    });
  }

  async findAllPaginated(
    query: WaterProfileQueryInput,
    user: User,
  ): Promise<PaginatedResult<WaterProfile>> {
    const where: FilterQuery<WaterProfile> = {};

    if (query.search) {
      where.$and = [
        {
          $or: [{ user }, { user: null }],
        },
        {
          $or: [
            { name: { $ilike: `%${query.search}%` } },
            { origin: { $ilike: `%${query.search}%` } },
            { recommendedStyle: { $ilike: `%${query.search}%` } },
            { notes: { $ilike: `%${query.search}%` } },
          ],
        },
      ];
    } else {
      where.$or = [{ user }, { user: null }];
    }

    const sortField = query.sortBy || WaterProfileSortBy.NAME;
    const sortOrder =
      query.order === SortOrder.ASC ? QueryOrder.ASC : QueryOrder.DESC;

    const orderBy: QueryOrderMap<WaterProfile> = {
      [sortField]: sortOrder,
    } as QueryOrderMap<WaterProfile>;

    const [data, total] = await this.em.findAndCount(WaterProfile, where, {
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
