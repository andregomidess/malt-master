import { defineConfig } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { SoftDeleteHandler } from 'mikro-orm-soft-delete';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

export default defineConfig({
  driver: PostgreSqlDriver,
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || 'root',
  dbName: process.env.DATABASE_NAME || 'malt_master',

  debug: process.env.NODE_ENV !== 'production',
  highlighter: new SqlHighlighter(),

  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],

  migrations: {
    path: 'dist/database/migrations',
    pathTs: 'src/database/migrations',
    tableName: 'mikro_orm_migrations',
    transactional: true,
    disableForeignKeys: false,
    allOrNothing: true,
    dropTables: false,
    safe: false,
    emit: 'ts',
    snapshot: false,
  },

  extensions: [
    {
      register(orm) {
        orm.em
          .getConnection()
          .execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
          .catch(() => {});
      },
    },
    SoftDeleteHandler,
  ],

  schemaGenerator: {
    disableForeignKeys: false,
    createForeignKeyConstraints: true,
  },
});
