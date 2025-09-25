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
import { HopService } from '../services/hop.service';
import { HopInput } from '../inputs/hop.input';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('hops')
export class HopController {
  constructor(private readonly hopService: HopService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return await this.hopService.findAll();
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async saveHop(@Body() hopInput: HopInput) {
    return await this.hopService.save(hopInput);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string) {
    return await this.hopService.findById(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteById(@Param('id') id: string) {
    return await this.hopService.softDelete(id);
  }

  @Patch(':id/recovery')
  @UseGuards(JwtAuthGuard)
  async recoveryById(@Param('id') id: string) {
    return await this.hopService.recovery(id);
  }
}
