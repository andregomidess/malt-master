import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { User } from './entities/user.entity';
import { type UserInput } from './inputs/user.input';
import { BaseEntityService } from '../database/common/services/base-entity.service';
import { Recipe } from 'src/recipes/entities/recipe.entity';
import { Batch } from 'src/batches/entities/batch.entity';

@Injectable()
export class UsersService extends BaseEntityService<User> {
  constructor(em: EntityManager) {
    super(em, User);
  }

  async updateUser(userInput: UserInput): Promise<User> {
    return await this.save(userInput);
  }

  async getUser(id: string): Promise<User | null> {
    return await this.findById(id);
  }

  async getUsers(): Promise<User[]> {
    return await this.em.find(User, {});
  }

  async deleteUser(id: string): Promise<User> {
    const user = await this.findById(id);

    if (!user) throw new NotFoundException('User not found');

    await this.em.transactional((em) => em.remove(user));

    return user;
  }

  async getUserMetrics(userId: string) {
    const totalRecipes = await this.em.count(Recipe, { user: userId });

    const completedBatches = await this.em.find(Batch, {
      user: userId,
      finalVolume: { $ne: null },
    });

    const totalBeerProduced = completedBatches.reduce(
      (acc, batch) => acc + (batch.finalVolume ?? 0),
      0,
    );

    const lastBatch = await this.em.findOne(
      Batch,
      { user: userId, brewDate: { $ne: null } },
      { orderBy: { brewDate: 'desc' } },
    );

    return {
      totalRecipes,
      totalBeerProduced,
      lastBatch: lastBatch
        ? {
            id: lastBatch.id,
            name: lastBatch.name,
            batchCode: lastBatch.batchCode,
            brewDate: lastBatch.brewDate,
            status: lastBatch.status,
          }
        : null,
    };
  }

  async recoveryUser(id: string): Promise<User> {
    const user = await this.findById(id);

    if (!user) throw new NotFoundException('User not found');

    if (!user.deletedAt) throw new BadRequestException('User is not deleted');

    user.deletedAt = null;

    await this.em.flush();

    return user;
  }
}
