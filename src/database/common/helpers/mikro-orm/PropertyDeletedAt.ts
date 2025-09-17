import { Property, t } from '@mikro-orm/core';
import { SoftDeletable } from 'mikro-orm-soft-delete';

type EntityConstructor = abstract new (
  ...args: any[]
) => Record<string, unknown>;

export function PropertyDeletedAt() {
  return (target: object, propertyName: string) => {
    Property({ type: t.datetime, nullable: true })(target, propertyName);

    const constructor = target.constructor as EntityConstructor;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    (SoftDeletable as any)({
      type: () => constructor,
      field: propertyName,
      value: () => new Date(),
      valueInitial: null,
    })(constructor);
  };
}
