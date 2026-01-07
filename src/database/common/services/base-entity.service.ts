import {
  EntityManager,
  EntityClass,
  FilterQuery,
  RequiredEntityData,
} from '@mikro-orm/core';
import { BadRequestException } from '@nestjs/common';

interface BaseEntity {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}

type EntityResolver<T extends BaseEntity> = (
  data: Partial<T>,
) => EntityClass<T>;

export abstract class BaseEntityService<T extends BaseEntity> {
  constructor(
    protected readonly em: EntityManager,
    protected readonly entityClass: EntityClass<T>,
    private readonly entityResolver?: EntityResolver<T>,
  ) {}

  async save(data: Partial<T> & { id?: string }): Promise<T> {
    if (data.id) {
      const existingEntity = await this.em.findOne(this.entityClass, {
        id: data.id,
      } as FilterQuery<T>);

      if (existingEntity) {
        this.em.assign(existingEntity, data as any);
        await this.em.flush();
        return existingEntity;
      }
    }

    const entityClass = this.entityResolver
      ? this.entityResolver(data)
      : this.entityClass;

    const newEntity = this.em.create(
      entityClass,
      data as RequiredEntityData<T>,
    );

    await this.em.persistAndFlush(newEntity);
    return newEntity;
  }

  async findById(id: string): Promise<T | null> {
    return await this.em.findOne(this.entityClass, {
      id,
    } as FilterQuery<T>);
  }

  async findByIdOrFail(id: string): Promise<T> {
    return await this.em.findOneOrFail(this.entityClass, {
      id,
    } as FilterQuery<T>);
  }

  async softDelete(id: string): Promise<T> {
    const entity = await this.findByIdOrFail(id);

    if (entity.deletedAt)
      throw new BadRequestException('Entity is already deleted');
    entity.deletedAt = new Date();

    await this.em.persistAndFlush(entity);

    return entity;
  }

  async recovery(id: string): Promise<T> {
    const entity = await this.findByIdOrFail(id);

    if (!entity.deletedAt)
      throw new BadRequestException('Entity is not deleted');

    entity.deletedAt = null;

    await this.em.persistAndFlush(entity);

    return entity;
  }
}
