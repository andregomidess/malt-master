import { BaseEntityService } from 'src/database/common/services/base-entity.service';
import { WaterProfile } from '../entities/water-profile.entity';
import { EntityManager } from '@mikro-orm/core';

export class WaterProfileService extends BaseEntityService<WaterProfile> {
  constructor(em: EntityManager) {
    super(em, WaterProfile);
  }

  async findAll(): Promise<WaterProfile[]> {
    return await this.em.find(WaterProfile, {});
  }
}
