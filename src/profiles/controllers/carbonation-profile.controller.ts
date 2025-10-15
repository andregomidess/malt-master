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
import { CarbonationProfileService } from '../services/carbonation-profile.service';
import { CarbonationProfileInput } from '../inputs/carbonation-profile.input';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('carbonation-profiles')
export class CarbonationProfileController {
  constructor(
    private readonly carbonationProfileService: CarbonationProfileService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return await this.carbonationProfileService.findAll();
  }

  @Get('public')
  @UseGuards(JwtAuthGuard)
  async findPublic() {
    return await this.carbonationProfileService.findPublic();
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async save(@Body() carbonationProfileInput: CarbonationProfileInput) {
    return await this.carbonationProfileService.saveProfile(
      carbonationProfileInput,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string) {
    return await this.carbonationProfileService.findById(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteById(@Param('id') id: string) {
    return await this.carbonationProfileService.softDelete(id);
  }

  @Patch(':id/recovery')
  @UseGuards(JwtAuthGuard)
  async recoveryById(@Param('id') id: string) {
    return await this.carbonationProfileService.recovery(id);
  }
}
