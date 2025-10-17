import { Injectable } from '@nestjs/common';
import { BaseEntityService } from 'src/database/common/services/base-entity.service';
import { TastingNote } from './entities/tasting-note.entity';
import { EntityManager } from '@mikro-orm/core';

@Injectable()
export class TastingNotesService extends BaseEntityService<TastingNote> {
  constructor(em: EntityManager) {
    super(em, TastingNote);
  }

  async findAllByUser(userId: string): Promise<TastingNote[]> {
    return await this.em.find(
      TastingNote,
      { user: { id: userId } },
      {
        orderBy: { tastingDate: 'DESC' },
        populate: ['batch', 'user'],
      },
    );
  }

  async findAllByBatch(batchId: string): Promise<TastingNote[]> {
    return await this.em.find(
      TastingNote,
      { batch: { id: batchId } },
      {
        orderBy: { tastingDate: 'DESC' },
        populate: ['batch', 'user'],
      },
    );
  }

  override async findById(id: string): Promise<TastingNote | null> {
    return await this.em.findOne(
      TastingNote,
      { id },
      { populate: ['batch', 'user'] },
    );
  }

  async calculateBatchAverageScores(batchId: string) {
    const notes = await this.findAllByBatch(batchId);

    if (notes.length === 0) return null;

    const totals = notes.reduce(
      (acc, note) => {
        return {
          appearance: acc.appearance + (note.appearanceScore || 0),
          aroma: acc.aroma + (note.aromaScore || 0),
          flavor: acc.flavor + (note.flavorScore || 0),
          mouthfeel: acc.mouthfeel + (note.mouthfeelScore || 0),
          overall: acc.overall + note.overallScore,
        };
      },
      { appearance: 0, aroma: 0, flavor: 0, mouthfeel: 0, overall: 0 },
    );

    const count = notes.length;

    return {
      averageAppearance: Number((totals.appearance / count).toFixed(2)),
      averageAroma: Number((totals.aroma / count).toFixed(2)),
      averageFlavor: Number((totals.flavor / count).toFixed(2)),
      averageMouthfeel: Number((totals.mouthfeel / count).toFixed(2)),
      averageOverall: Number((totals.overall / count).toFixed(2)),
      totalNotes: count,
    };
  }

  async calculateUserStatistics(userId: string) {
    const notes = await this.findAllByUser(userId);

    if (notes.length === 0) return null;

    const totals = notes.reduce(
      (acc, note) => {
        return {
          appearance: acc.appearance + (note.appearanceScore || 0),
          aroma: acc.aroma + (note.aromaScore || 0),
          flavor: acc.flavor + (note.flavorScore || 0),
          mouthfeel: acc.mouthfeel + (note.mouthfeelScore || 0),
          overall: acc.overall + note.overallScore,
        };
      },
      { appearance: 0, aroma: 0, flavor: 0, mouthfeel: 0, overall: 0 },
    );

    const count = notes.length;

    const overallScores = notes.map((note) => note.overallScore);
    const highestScore = Math.max(...overallScores);
    const lowestScore = Math.min(...overallScores);

    return {
      totalTastings: count,
      averageAppearance: Number((totals.appearance / count).toFixed(2)),
      averageAroma: Number((totals.aroma / count).toFixed(2)),
      averageFlavor: Number((totals.flavor / count).toFixed(2)),
      averageMouthfeel: Number((totals.mouthfeel / count).toFixed(2)),
      averageOverall: Number((totals.overall / count).toFixed(2)),
      highestScore,
      lowestScore,
    };
  }

  async findRecentByUser(
    userId: string,
    limit: number = 5,
  ): Promise<TastingNote[]> {
    return await this.em.find(
      TastingNote,
      { user: { id: userId } },
      {
        orderBy: { tastingDate: 'DESC' },
        populate: ['batch', 'user'],
        limit,
      },
    );
  }
}
