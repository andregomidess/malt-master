import { Property, t } from '@mikro-orm/core';

export function PropertyUpdatedAt() {
  return Property({
    type: t.datetime,
    defaultRaw: 'CURRENT_TIMESTAMP',
    onUpdate: () => new Date(),
  });
}
