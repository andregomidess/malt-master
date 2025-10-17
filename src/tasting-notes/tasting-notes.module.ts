import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TastingNotesService } from './tasting-notes.service';
import { TastingNotesController } from './tasting-notes.controller';
import { TastingNote } from './entities/tasting-note.entity';

@Module({
  imports: [MikroOrmModule.forFeature([TastingNote])],
  controllers: [TastingNotesController],
  providers: [TastingNotesService],
  exports: [TastingNotesService],
})
export class TastingNotesModule {}
