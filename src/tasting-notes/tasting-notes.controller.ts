import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  Request,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { TastingNotesService } from './tasting-notes.service';
import { TastingNoteInput } from './inputs/tasting-note.input';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';

@Controller('tasting-notes')
@UseGuards(JwtAuthGuard)
export class TastingNotesController {
  constructor(private readonly tastingNotesService: TastingNotesService) {}

  @Get()
  async findAllByUser(@Request() req: Request & { user: User }) {
    return await this.tastingNotesService.findAllByUser(req.user.id);
  }

  @Get('recent')
  async findRecent(
    @Request() req: Request & { user: User },
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 5;
    return await this.tastingNotesService.findRecentByUser(
      req.user.id,
      limitNum,
    );
  }

  @Get('statistics')
  async getUserStatistics(@Request() req: Request & { user: User }) {
    return await this.tastingNotesService.calculateUserStatistics(req.user.id);
  }

  @Get('batch/:batchId')
  async findAllByBatch(@Param('batchId') batchId: string) {
    return await this.tastingNotesService.findAllByBatch(batchId);
  }

  @Get('batch/:batchId/averages')
  async getBatchAverages(@Param('batchId') batchId: string) {
    return await this.tastingNotesService.calculateBatchAverageScores(batchId);
  }

  @Put()
  async save(
    @Body() tastingNoteInput: TastingNoteInput,
    @Request() req: Request & { user: User },
  ) {
    return await this.tastingNotesService.save({
      ...tastingNoteInput,
      user: req.user,
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.tastingNotesService.findById(id);
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    return await this.tastingNotesService.softDelete(id);
  }

  @Patch(':id/recovery')
  async recoveryById(@Param('id') id: string) {
    return await this.tastingNotesService.recovery(id);
  }
}
