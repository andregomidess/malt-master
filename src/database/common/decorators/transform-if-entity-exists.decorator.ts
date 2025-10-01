import {
  registerDecorator,
  ValidationOptions,
  IsUUID,
  IsOptional,
} from 'class-validator';
import {
  TransformIfEntityExistsConstraint,
  TransformIfEntityExistsOptions,
} from '../constraints/transform-if-entity-exists.constraint';

export function TransformIfEntityExists<Entity extends object>(
  options: TransformIfEntityExistsOptions<Entity> & { optional?: boolean },
  validationOptions?: ValidationOptions,
) {
  return function (target: object, propertyName: string) {
    if (options.optional) IsOptional()(target, propertyName);

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
