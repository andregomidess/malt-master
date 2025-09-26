import { registerDecorator, ValidationOptions } from 'class-validator';
import { EntityExistsConstraint } from '../constraints/entity-exists.constraint';
import { EntityClass } from '@mikro-orm/core';

export function EntityExists(
  entity: EntityClass<unknown>,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entity],
      validator: EntityExistsConstraint,
    });
  };
}
