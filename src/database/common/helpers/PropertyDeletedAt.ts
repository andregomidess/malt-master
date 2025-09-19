import { Property, t } from '@mikro-orm/core';
import { SoftDeletable } from 'mikro-orm-soft-delete';

export function PropertyDeletedAt() {
  return (target: object, propertyName: string) => {
    Property({ type: t.datetime, nullable: true })(target, propertyName);

    const constructor = target.constructor as abstract new (
      ...args: any[]
    ) => Record<string, unknown>;

    SoftDeletable(
      () => constructor,
      propertyName,
      () => new Date(),
    )(constructor);
  };
}
