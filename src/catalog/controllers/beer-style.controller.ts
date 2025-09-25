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
import { BeerStyleService } from '../services/beer-style.service';
import { BeerStyleInput } from '../inputs/beer-style.input';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('beer-styles')
export class BeerStyleController {
  constructor(private readonly beerStyleService: BeerStyleService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return await this.beerStyleService.findAll();
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async saveBeerStyle(@Body() beerStyleInput: BeerStyleInput) {
    return await this.beerStyleService.save(beerStyleInput);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string) {
    return await this.beerStyleService.findById(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteById(@Param('id') id: string) {
    return await this.beerStyleService.softDelete(id);
  }

  @Patch(':id/recovery')
  @UseGuards(JwtAuthGuard)
  async recoveryBeerStyle(@Param('id') id: string) {
    return await this.beerStyleService.recovery(id);
  }
}
