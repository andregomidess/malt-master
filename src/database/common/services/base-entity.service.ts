import {
  EntityManager,
  EntityClass,
  FilterQuery,
  RequiredEntityData,
} from '@mikro-orm/core';

interface BaseEntity {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export abstract class BaseEntityService<T extends BaseEntity> {
  constructor(
    protected readonly em: EntityManager,
    protected readonly entityClass: EntityClass<T>,
  ) {}

  async save(data: Partial<T> & { id?: string }): Promise<T> {
    if (data.id) {
      const existingEntity = await this.em.findOne(this.entityClass, {
        id: data.id,
      } as FilterQuery<T>);

      if (existingEntity) {
        Object.assign(existingEntity, data);
        await this.em.flush();
        return existingEntity;
      }
    }

    const newEntity = this.em.create(
      this.entityClass,
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
}
