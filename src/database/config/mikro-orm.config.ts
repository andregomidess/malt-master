import { defineConfig } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { SoftDeleteHandler } from 'mikro-orm-soft-delete';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import * as dns from 'dns';

try {
  dns.setDefaultResultOrder('ipv4first');
} catch (error) {
  console.warn('Não foi possível configurar DNS para IPv4 primeiro:', error);
}

interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  dbName: string;
  driverOptions?: {
    connection: {
      ssl: {
        rejectUnauthorized: boolean;
      };
    };
  };
}

const getDatabaseConfig = (): DatabaseConfig => {
  if (process.env.DATABASE_URL) {
    try {
      const url = new URL(process.env.DATABASE_URL);
      const dbName = url.pathname.slice(1);
      let hostname = url.hostname;

      if (hostname.startsWith('[') && hostname.endsWith(']')) {
        hostname = hostname.slice(1, -1);
      }

      const hasSslMode = url.searchParams.has('sslmode');
      const sslMode = url.searchParams.get('sslmode');

      const config: DatabaseConfig = {
        host: hostname,
        port: parseInt(url.port || '5432'),
        user: url.username,
        password: url.password,
        dbName: dbName,
      };

      if (
        hasSslMode &&
        (sslMode === 'require' ||
          sslMode === 'prefer' ||
          sslMode === 'verify-full')
      ) {
        config.driverOptions = {
          connection: {
            ssl: {
              rejectUnauthorized: sslMode === 'verify-full',
            },
          },
        };
      }

      return config;
    } catch (error) {
      console.error('Erro ao fazer parse da DATABASE_URL:', error);
    }
  }

  let host = process.env.DATABASE_HOST || 'localhost';
  if (host.startsWith('[') && host.endsWith(']')) {
    host = host.slice(1, -1);
  }

  return {
    host: host,
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || 'root',
    dbName: process.env.DATABASE_NAME || 'malt_master',
  };
};

const dbConfig: DatabaseConfig = getDatabaseConfig();

export default defineConfig({
  driver: PostgreSqlDriver,
  ...dbConfig,

  debug: process.env.NODE_ENV !== 'production',
  highlighter: new SqlHighlighter(),

  entities: ['dist/**/*.entity.js'],

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
