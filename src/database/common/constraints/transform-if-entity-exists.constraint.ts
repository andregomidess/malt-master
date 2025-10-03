import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { EntityClass, EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

export interface TransformIfEntityExistsOptions<Entity extends object> {
  entity: EntityClass<Entity>;
}

@ValidatorConstraint({ name: 'transformIfEntityExists', async: true })
@Injectable()
export class TransformIfEntityExistsConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly em: EntityManager) {}

  async validate(value: object, args: ValidationArguments) {
    if (!value) return true;

    const [options] = args.constraints as [
      TransformIfEntityExistsOptions<object>,
    ];

    if (
      typeof value === 'object' &&
      value?.constructor?.name === options.entity.name
    )
      return true;

    if (typeof value === 'string') {
      const repository = this.em.getRepository(options.entity);
      const foundEntity = await repository.findOne({ id: value });

      if (foundEntity) {
        const target = args.object;
        target[args.property] = foundEntity;
        return true;
      }
    }

    return false;
  }

  defaultMessage(args: ValidationArguments) {
    const [options] = args.constraints as [
      TransformIfEntityExistsOptions<object>,
    ];

    return `${options.entity.name} with ID "${args.value}" does not exist.`;
  }
}
