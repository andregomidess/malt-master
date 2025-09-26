// src/database/common/constraints/entity-exists.constraint.ts
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { EntityClass, EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'entityExists', async: true })
@Injectable()
export class EntityExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly em: EntityManager) {}

  async validate(value: string, args: ValidationArguments) {
    if (!value) return true;

    const [entity] = args.constraints as [EntityClass<unknown>];

    const count = await this.em.count(entity, { id: value });

    return count > 0;
  }

  defaultMessage(args: ValidationArguments) {
    const [entity] = args.constraints as [EntityClass<unknown>];
    return `${entity.name} with this ID does not exist.`;
  }
}
