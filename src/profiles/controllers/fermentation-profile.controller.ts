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
import { FermentationProfileService } from '../services/fermentation-profile.service';
import { FermentationProfileInput } from '../inputs/fermentation-profile.input';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('fermentation-profiles')
export class FermentationProfileController {
  constructor(
    private readonly fermentationProfileService: FermentationProfileService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return await this.fermentationProfileService.findAll();
  }

  @Get('public')
  @UseGuards(JwtAuthGuard)
  async findPublic() {
    return await this.fermentationProfileService.findPublic();
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async save(@Body() fermentationProfileInput: FermentationProfileInput) {
    return await this.fermentationProfileService.saveProfile(
      fermentationProfileInput,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string) {
    return await this.fermentationProfileService.findById(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteById(@Param('id') id: string) {
    return await this.fermentationProfileService.softDelete(id);
  }

  @Patch(':id/recovery')
  @UseGuards(JwtAuthGuard)
  async recoveryById(@Param('id') id: string) {
    return await this.fermentationProfileService.recovery(id);
  }
}
