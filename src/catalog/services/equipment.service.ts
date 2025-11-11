import {
  EntityManager,
  QueryOrder,
  type FilterQuery,
  type QueryOrderMap,
} from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import {
  Equipment,
  KettleEquipment,
  FermenterEquipment,
  ChillerEquipment,
  EquipmentType,
} from '../entities/equipment.entity';
import { BaseEntityService } from 'src/database/common/services/base-entity.service';
import { equipmentResolver } from '../resolvers/equipment.resolver';
import { type EquipmentInputUnion } from '../inputs/equipment.input';
import {
  EquipmentQueryInput,
  EquipmentSortBy,
  SortOrder,
} from '../inputs/equipment-query.input';

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
  ): Promise<PaginatedResult<Equipment>> {
    const where: FilterQuery<Equipment> = {};
    if (query.type) where.type = query.type;

    if (query.search) {
      where.$or = [
        { name: { $ilike: `%${query.search}%` } },
        { description: { $ilike: `%${query.search}%` } },
      ];
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
  ): Promise<PaginatedResult<KettleEquipment>> {
    return this.findByTypeWithPagination(EquipmentType.KETTLE, query);
  }

  async findFermenters(
    query: EquipmentQueryInput,
  ): Promise<PaginatedResult<FermenterEquipment>> {
    return this.findByTypeWithPagination(EquipmentType.FERMENTER, query);
  }

  async findChillers(
    query: EquipmentQueryInput,
  ): Promise<PaginatedResult<ChillerEquipment>> {
    return this.findByTypeWithPagination(EquipmentType.CHILLER, query);
  }

  private async findByTypeWithPagination<T extends Equipment>(
    type: EquipmentType,
    query: EquipmentQueryInput,
  ): Promise<PaginatedResult<T>> {
    const where: FilterQuery<Equipment> = { type };

    if (query.search) {
      where.$or = [
        { name: { $ilike: `%${query.search}%` } },
        { description: { $ilike: `%${query.search}%` } },
      ];
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
      data: data as T[],
      total,
      page: query.page,
      totalPages: Math.ceil(total / query.take),
    };
  }

  async findByType<T extends Equipment>(type: EquipmentType): Promise<T[]> {
    return (await this.em.find(Equipment, { type })) as T[];
  }
}
