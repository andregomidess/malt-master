import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import { FermentableService } from '../services/fermentable.service';
import { FermentableInput } from '../inputs/fermentable.input';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('fermentables')
export class FermentableController {
  constructor(private readonly fermentableService: FermentableService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return await this.fermentableService.findAll();
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async save(@Body() fermentableInput: FermentableInput) {
    return await this.fermentableService.save(fermentableInput);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string) {
    return await this.fermentableService.findById(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteById(@Param('id') id: string) {
    return await this.fermentableService.softDelete(id);
  }

  @Patch(':id/recovery')
  @UseGuards(JwtAuthGuard)
  async recoveryById(@Param('id') id: string) {
    return await this.fermentableService.recovery(id);
  }
}
