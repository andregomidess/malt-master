import { BaseEntityService } from '../../database/common/services/base-entity.service';
import { BeerStyle } from '../entities/beer-style.entity';
import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BeerStyleService extends BaseEntityService<BeerStyle> {
  constructor(em: EntityManager) {
    super(em, BeerStyle);
  }

  async findAll(): Promise<BeerStyle[]> {
    return await this.em.find(BeerStyle, {});
  }
}
