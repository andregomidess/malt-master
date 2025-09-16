import { PrimaryKey } from '@mikro-orm/core';

export function PrimaryKeyUUID(version: 'v4' | 'v7' = 'v4') {
  if (version === 'v4')
    return PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' });

  if (version === 'v7') return PrimaryKey({ type: 'uuid' });

  throw new Error('Invalid UUID version');
}
