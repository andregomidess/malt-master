import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { BaseEntityService } from 'src/database/common/services/base-entity.service';
import { Batch } from './entities/batch.entity';
import { BatchInput } from './inputs/batch.input';

@Injectable()
export class BatchesService extends BaseEntityService<Batch> {
  constructor(protected override readonly em: EntityManager) {
    super(em, Batch);
  }

  async upsertBatch(input: BatchInput): Promise<Batch> {
    return await this.save(input);
  }

  async deleteBatch(userId: string, batchId: string): Promise<void> {
    const batch = await this.em.findOneOrFail(Batch, {
      id: batchId,
      user: userId,
    });

    await this.em.removeAndFlush(batch);
  }
}
