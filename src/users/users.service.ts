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

  private excludeSensitiveFields(
    user: User,
  ): Omit<
    User,
    | 'password'
    | 'refreshToken'
    | 'emailVerificationToken'
    | 'passwordResetToken'
    | 'passwordResetExpiry'
  > {
    const sensitiveFields = [
      'password',
      'refreshToken',
      'emailVerificationToken',
      'passwordResetToken',
      'passwordResetExpiry',
    ];
    const userWithoutSensitiveFields = Object.fromEntries(
      Object.entries(user).filter(([key]) => !sensitiveFields.includes(key)),
    ) as Omit<
      User,
      | 'password'
      | 'refreshToken'
      | 'emailVerificationToken'
      | 'passwordResetToken'
      | 'passwordResetExpiry'
    >;
    return userWithoutSensitiveFields;
  }

  async updateUser(userInput: UserInput): Promise<User> {
    if (userInput.id) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, email, ...userDataWithoutPassword } = userInput;

      if (!userInput.password) {
        const savedUser = await this.save(userDataWithoutPassword);
        return this.excludeSensitiveFields(savedUser) as User;
      }

      const savedUser = await this.save(userInput);
      return this.excludeSensitiveFields(savedUser) as User;
    }

    const savedUser = await this.save(userInput);
    return this.excludeSensitiveFields(savedUser) as User;
  }

  async getUser(id: string): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) return null;
    return this.excludeSensitiveFields(user) as User;
  }

  async getUsers(): Promise<User[]> {
    const users = await this.em.find(User, {});
    return users.map((user) => this.excludeSensitiveFields(user) as User);
  }

  async deleteUser(id: string): Promise<User> {
    const user = await this.findById(id);

    if (!user) throw new NotFoundException('User not found');

    await this.em.transactional((em) => em.remove(user));

    return this.excludeSensitiveFields(user) as User;
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

    return this.excludeSensitiveFields(user) as User;
  }
}
