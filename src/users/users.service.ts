import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { User } from './entities/user.entity';
import { type UserInput } from './inputs/user.input';
import { BaseEntityService } from '../database/common/services/base-entity.service';

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

  async recoveryUser(id: string): Promise<User> {
    const user = await this.findById(id);

    if (!user) throw new NotFoundException('User not found');

    if (!user.deletedAt) throw new BadRequestException('User is not deleted');

    user.deletedAt = null;

    await this.em.flush();

    return user;
  }
}
