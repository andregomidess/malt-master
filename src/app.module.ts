import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { RecipesModule } from './recipes/recipes.module';
import { BatchesModule } from './batches/batches.module';
import { CatalogModule } from './catalog/catalog.module';
import { ProfilesModule } from './profiles/profiles.module';
import { InventoryModule } from './inventory/inventory.module';
import { TastingNotesModule } from './tasting-notes/tasting-notes.module';
import { CommunityModule } from './community/community.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    RecipesModule,
    BatchesModule,
    CatalogModule,
    ProfilesModule,
    InventoryModule,
    TastingNotesModule,
    CommunityModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
