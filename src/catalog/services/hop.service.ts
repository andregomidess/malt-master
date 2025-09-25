import { EntityManager } from '@mikro-orm/core';
import { Hop } from '../entities/hop.entity';
import { BaseEntityService } from 'src/database/common/services/base-entity.service';

export class HopService extends BaseEntityService<Hop> {
  constructor(em: EntityManager) {
    super(em, Hop);
  }

  async findAll(): Promise<Hop[]> {
    return await this.em.find(Hop, {});
  }
}
