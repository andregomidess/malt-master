import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from './config/mikro-orm.config';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      ...mikroOrmConfig,
      allowGlobalContext: true,
      autoLoadEntities: true,
      pool: {
        min: 2,
        max: 10,
      },
    }),
  ],
})
export class DatabaseModule {}
