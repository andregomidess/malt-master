import {
  EntityManager,
  QueryOrder,
  type FilterQuery,
  type QueryOrderMap,
} from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { BaseEntityService } from 'src/database/common/services/base-entity.service';
import { TastingNote } from './entities/tasting-note.entity';
import {
  TastingNoteQueryInput,
  TastingNoteSortBy,
  SortOrder,
} from './queries/tasting-note.query';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

@Injectable()
export class TastingNotesService extends BaseEntityService<TastingNote> {
  constructor(em: EntityManager) {
    super(em, TastingNote);
  }

  private transformDecimalFields(note: TastingNote): TastingNote {
    if (!note) return note;

    return {
      ...note,
      appearanceScore:
        note.appearanceScore !== null && note.appearanceScore !== undefined
          ? typeof note.appearanceScore === 'string'
            ? parseFloat(note.appearanceScore)
            : note.appearanceScore
          : null,
      aromaScore:
        note.aromaScore !== null && note.aromaScore !== undefined
          ? typeof note.aromaScore === 'string'
            ? parseFloat(note.aromaScore)
            : note.aromaScore
          : null,
      flavorScore:
        note.flavorScore !== null && note.flavorScore !== undefined
          ? typeof note.flavorScore === 'string'
            ? parseFloat(note.flavorScore)
            : note.flavorScore
          : null,
      mouthfeelScore:
        note.mouthfeelScore !== null && note.mouthfeelScore !== undefined
          ? typeof note.mouthfeelScore === 'string'
            ? parseFloat(note.mouthfeelScore)
            : note.mouthfeelScore
          : null,
      overallScore:
        typeof note.overallScore === 'string'
          ? parseFloat(note.overallScore)
          : note.overallScore,
    };
  }

  async findAllByUser(userId: string): Promise<TastingNote[]> {
    const notes = await this.em.find(
      TastingNote,
      { user: { id: userId } },
      {
        orderBy: { tastingDate: 'DESC' },
        populate: ['batch', 'user'],
      },
    );
    return notes.map((note) => this.transformDecimalFields(note));
  }

  async findAllPaginatedByUser(
    userId: string,
    query: TastingNoteQueryInput,
  ): Promise<PaginatedResult<TastingNote>> {
    const where: FilterQuery<TastingNote> = {
      user: { id: userId },
    };

    if (query.batchId) {
      where.batch = { id: query.batchId };
    }

    if (query.search) {
      where.$or = [
        { pros: { $ilike: `%${query.search}%` } },
        { cons: { $ilike: `%${query.search}%` } },
        { generalNotes: { $ilike: `%${query.search}%` } },
      ];
    }

    const sortField = query.sortBy || TastingNoteSortBy.TASTING_DATE;
    const sortOrder =
      query.order === SortOrder.ASC ? QueryOrder.ASC : QueryOrder.DESC;

    const orderBy: QueryOrderMap<TastingNote> = {
      [sortField]: sortOrder,
    } as QueryOrderMap<TastingNote>;

    const [data, total] = await this.em.findAndCount(TastingNote, where, {
      orderBy,
      limit: query.limit,
      offset: query.offset,
      populate: ['batch', 'user'],
    });

    return {
      data: data.map((note) => this.transformDecimalFields(note)),
      total,
      page: query.page,
      totalPages: Math.ceil(total / query.take),
    };
  }

  async findAllByBatch(batchId: string): Promise<TastingNote[]> {
    const notes = await this.em.find(
      TastingNote,
      { batch: { id: batchId } },
      {
        orderBy: { tastingDate: 'DESC' },
        populate: ['batch', 'user'],
      },
    );
    return notes.map((note) => this.transformDecimalFields(note));
  }

  override async findById(id: string): Promise<TastingNote | null> {
    const note = await this.em.findOne(
      TastingNote,
      { id },
      { populate: ['batch', 'user'] },
    );
    return note ? this.transformDecimalFields(note) : null;
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
    const notes = await this.em.find(
      TastingNote,
      { user: { id: userId } },
      {
        orderBy: { tastingDate: 'DESC' },
        populate: ['batch', 'user'],
        limit,
      },
    );
    return notes.map((note) => this.transformDecimalFields(note));
  }

  override async save(
    data: Partial<TastingNote> & { id?: string },
  ): Promise<TastingNote> {
    const savedNote = await super.save(data);
    return this.transformDecimalFields(savedNote);
  }

  override async softDelete(id: string): Promise<TastingNote> {
    const deletedNote = await super.softDelete(id);
    return this.transformDecimalFields(deletedNote);
  }

  override async recovery(id: string): Promise<TastingNote> {
    const recoveredNote = await super.recovery(id);
    return this.transformDecimalFields(recoveredNote);
  }
}
