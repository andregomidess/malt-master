import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
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
import { YeastInput } from '../inputs/yeast.input';
import { YeastService } from '../services/yeast.service';

@Controller('yeasts')
export class YeastController {
  constructor(private readonly yeastService: YeastService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return await this.yeastService.findAll();
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async save(@Body() yeastInput: YeastInput) {
    return await this.yeastService.save(yeastInput);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string) {
    return await this.yeastService.findById(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteById(@Param('id') id: string) {
    return await this.yeastService.softDelete(id);
  }

  @Patch(':id/recovery')
  @UseGuards(JwtAuthGuard)
  async recoveryById(@Param('id') id: string) {
    return await this.yeastService.recovery(id);
  }
}
