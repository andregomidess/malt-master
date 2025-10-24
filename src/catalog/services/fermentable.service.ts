import { BaseEntityService } from 'src/database/common/services/base-entity.service';
import { Fermentable } from '../entities/fermentable.entity';
import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FermentableService extends BaseEntityService<Fermentable> {
  constructor(em: EntityManager) {
    super(em, Fermentable);
  }

  async findAll(): Promise<Fermentable[]> {
    return await this.em.find(Fermentable, {});
  }
}
