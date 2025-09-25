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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WaterProfileService } from '../services/water-profile.service';
import { WaterProfileInput } from '../inputs/water-profile.input';

@Controller('water-profiles')
export class WaterProfileController {
  constructor(private readonly waterProfileService: WaterProfileService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return await this.waterProfileService.findAll();
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async save(@Body() waterProfileInput: WaterProfileInput) {
    return await this.waterProfileService.save(waterProfileInput);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string) {
    return await this.waterProfileService.findById(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteById(@Param('id') id: string) {
    return await this.waterProfileService.softDelete(id);
  }

  @Patch(':id/recovery')
  @UseGuards(JwtAuthGuard)
  async recoveryById(@Param('id') id: string) {
    return await this.waterProfileService.recovery(id);
  }
}
