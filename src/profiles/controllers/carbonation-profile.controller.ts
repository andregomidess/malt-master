import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CarbonationProfileService } from '../services/carbonation-profile.service';
import { CarbonationProfileInput } from '../inputs/carbonation-profile.input';
import { CarbonationProfile } from '../entities/carbonation-profile.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('carbonation-profiles')
export class CarbonationProfileController {
  constructor(
    private readonly carbonationProfileService: CarbonationProfileService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Request() req: AuthenticatedRequest,
  ): Promise<CarbonationProfile[]> {
    return await this.carbonationProfileService.findAllByUser(req.user.id);
  }

  @Get('public')
  @UseGuards(JwtAuthGuard)
  async findPublic(): Promise<CarbonationProfile[]> {
    return await this.carbonationProfileService.findPublic();
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async save(
    @Request() req: AuthenticatedRequest,
    @Body() carbonationProfileInput: CarbonationProfileInput,
  ): Promise<CarbonationProfile> {
    return await this.carbonationProfileService.saveProfile({
      ...carbonationProfileInput,
      user: req.user,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<CarbonationProfile | null> {
    return await this.carbonationProfileService.findByIdForUser(
      id,
      req.user.id,
    );
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
