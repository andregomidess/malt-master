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
import { FermentationProfileService } from '../services/fermentation-profile.service';
import { FermentationProfileInput } from '../inputs/fermentation-profile.input';
import { FermentationProfile } from '../entities/fermentation-profile.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('fermentation-profiles')
export class FermentationProfileController {
  constructor(
    private readonly fermentationProfileService: FermentationProfileService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Request() req: AuthenticatedRequest,
  ): Promise<FermentationProfile[]> {
    return await this.fermentationProfileService.findAllByUser(req.user.id);
  }

  @Get('public')
  @UseGuards(JwtAuthGuard)
  async findPublic(): Promise<FermentationProfile[]> {
    return await this.fermentationProfileService.findPublic();
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async save(
    @Request() req: AuthenticatedRequest,
    @Body() fermentationProfileInput: FermentationProfileInput,
  ): Promise<FermentationProfile> {
    return await this.fermentationProfileService.saveProfile({
      ...fermentationProfileInput,
      user: req.user,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<FermentationProfile | null> {
    return await this.fermentationProfileService.findByIdForUser(
      id,
      req.user.id,
    );
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
