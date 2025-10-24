import { Global, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from './config/mikro-orm.config';
import { TransformIfEntityExistsConstraint } from './common/constraints/transform-if-entity-exists.constraint';

@Global()
@Module({
  imports: [
    MikroOrmModule.forRoot({
      ...mikroOrmConfig,
      allowGlobalContext: true,
      pool: {
        min: 2,
        max: 10,
      },
    }),
  ],
  providers: [TransformIfEntityExistsConstraint],
  exports: [TransformIfEntityExistsConstraint],
})
export class DatabaseModule {}
