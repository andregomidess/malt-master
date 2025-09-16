import { Property, t } from '@mikro-orm/core';

export function PropertyCreatedAt() {
  return Property({ type: t.datetime, defaultRaw: 'CURRENT_TIMESTAMP' });
}
