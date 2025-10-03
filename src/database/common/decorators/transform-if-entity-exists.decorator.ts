import { registerDecorator, ValidationOptions, IsUUID } from 'class-validator';
import {
  TransformIfEntityExistsConstraint,
  TransformIfEntityExistsOptions,
} from '../constraints/transform-if-entity-exists.constraint';

export function IsEntity<Entity extends object>(
  options: TransformIfEntityExistsOptions<Entity>,
  validationOptions?: ValidationOptions,
) {
  return function (target: object, propertyName: string) {
    IsUUID()(target, propertyName);

    registerDecorator({
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: TransformIfEntityExistsConstraint,
    });
  };
}
