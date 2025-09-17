import { Module } from '@nestjs/common';
import { TastingNotesService } from './tasting-notes.service';
import { TastingNotesController } from './tasting-notes.controller';

@Module({
  controllers: [TastingNotesController],
  providers: [TastingNotesService],
  exports: [TastingNotesService],
})
export class TastingNotesModule {}
