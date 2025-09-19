import { ConfigService } from '@nestjs/config';
import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { SoftDeleteHandler } from 'mikro-orm-soft-delete';

export const createDatabaseConfig = (
  configService: ConfigService,
): MikroOrmModuleOptions => ({
  driver: PostgreSqlDriver,
  host: configService.get<string>('DATABASE_HOST', 'localhost'),
  port: configService.get<number>('DATABASE_PORT', 5432),
  user: configService.get<string>('DATABASE_USER', 'root'),
  password: configService.get<string>('DATABASE_PASSWORD', 'root'),
  dbName: configService.get<string>('DATABASE_NAME', 'malt_master'),

  debug: configService.get<string>('NODE_ENV') !== 'production',
  allowGlobalContext: true,

  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],

  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
    tableName: 'mikro_orm_migrations',
    transactional: true,
    disableForeignKeys: false,
    allOrNothing: true,
    dropTables: false,
    safe: false,
    emit: 'ts',
  },
  autoLoadEntities: true,
  pool: {
    min: 2,
    max: 10,
  },
  extensions: [SoftDeleteHandler],
  schemaGenerator: {
    disableForeignKeys: false,
    createForeignKeyConstraints: true,
  },
});
