import {
  EntityManager,
  QueryOrder,
  type FilterQuery,
  type QueryOrderMap,
} from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Equipment, EquipmentType } from '../entities/equipment.entity';
import { BaseEntityService } from 'src/database/common/services/base-entity.service';
import { equipmentResolver } from '../resolvers/equipment.resolver';
import { type EquipmentInputUnion } from '../inputs/equipment.input';
import {
  EquipmentQueryInput,
  EquipmentSortBy,
  SortOrder,
} from '../inputs/equipment-query.input';
import { User } from 'src/users/entities/user.entity';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

@Injectable()
export class EquipmentService extends BaseEntityService<Equipment> {
  constructor(em: EntityManager) {
    super(em, Equipment, equipmentResolver);
  }

  override async save(data: EquipmentInputUnion): Promise<Equipment> {
    return await super.save(data);
  }

  async findAll(
    query: EquipmentQueryInput,
    user: User,
  ): Promise<PaginatedResult<Equipment>> {
    const where: FilterQuery<Equipment> = {};

    if (query.search) {
      const userCondition: FilterQuery<Equipment> = {
        $or: [{ user }, { user: null }],
      };
      if (query.type) {
        userCondition.type = query.type;
      }
      where.$and = [
        userCondition,
        {
          $or: [
            { name: { $ilike: `%${query.search}%` } },
            { description: { $ilike: `%${query.search}%` } },
          ],
        },
      ];
    } else {
      where.$or = [{ user }, { user: null }];
      if (query.type) where.type = query.type;
    }

    const sortField = query.sortBy || EquipmentSortBy.NAME;
    const sortOrder =
      query.order === SortOrder.ASC ? QueryOrder.ASC : QueryOrder.DESC;

    const orderBy: QueryOrderMap<Equipment> = {
      [sortField]: sortOrder,
    } as QueryOrderMap<Equipment>;

    const [data, total] = await this.em.findAndCount(Equipment, where, {
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

  async findKettles(
    query: EquipmentQueryInput,
    user: User,
  ): Promise<PaginatedResult<Equipment>> {
    return this.findByTypeWithPagination(EquipmentType.KETTLE, query, user);
  }

  async findFermenters(
    query: EquipmentQueryInput,
    user: User,
  ): Promise<PaginatedResult<Equipment>> {
    return this.findByTypeWithPagination(EquipmentType.FERMENTER, query, user);
  }

  async findChillers(
    query: EquipmentQueryInput,
    user: User,
  ): Promise<PaginatedResult<Equipment>> {
    return this.findByTypeWithPagination(EquipmentType.CHILLER, query, user);
  }

  private async findByTypeWithPagination(
    type: EquipmentType,
    query: EquipmentQueryInput,
    user: User,
  ): Promise<PaginatedResult<Equipment>> {
    const where: FilterQuery<Equipment> = {};

    if (query.search) {
      where.$and = [
        {
          type,
          $or: [{ user }, { user: null }],
        },
        {
          $or: [
            { name: { $ilike: `%${query.search}%` } },
            { description: { $ilike: `%${query.search}%` } },
          ],
        },
      ];
    } else {
      where.type = type;
      where.$or = [{ user }, { user: null }];
    }

    const sortField = query.sortBy || EquipmentSortBy.NAME;
    const sortOrder =
      query.order === SortOrder.ASC ? QueryOrder.ASC : QueryOrder.DESC;

    const orderBy: QueryOrderMap<Equipment> = {
      [sortField]: sortOrder,
    } as QueryOrderMap<Equipment>;

    const [data, total] = await this.em.findAndCount(Equipment, where, {
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

  async findByType(type: EquipmentType): Promise<Equipment[]> {
    return await this.em.find(Equipment, { type });
  }
}
