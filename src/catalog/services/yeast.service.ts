import { BaseEntityService } from 'src/database/common/services/base-entity.service';
import { Yeast } from '../entities/yeast.entity';
import { EntityManager } from '@mikro-orm/core';

export class YeastService extends BaseEntityService<Yeast> {
  constructor(em: EntityManager) {
    super(em, Yeast);
  }

  async findAll(): Promise<Yeast[]> {
    return await this.em.find(Yeast, {});
  }
}
