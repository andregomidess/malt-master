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
import { MashProfileService } from '../services/mash-profile.service';
import { MashProfileInput } from '../inputs/mash-profile.input';
import { MashProfile } from '../entities/mash-profile.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('mash-profiles')
export class MashProfileController {
  constructor(private readonly mashProfileService: MashProfileService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req: AuthenticatedRequest): Promise<MashProfile[]> {
    return await this.mashProfileService.findAllByUser(req.user.id);
  }

  @Get('public')
  @UseGuards(JwtAuthGuard)
  async findPublic(): Promise<MashProfile[]> {
    return await this.mashProfileService.findPublic();
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async save(
    @Request() req: AuthenticatedRequest,
    @Body() mashProfileInput: MashProfileInput,
  ): Promise<MashProfile> {
    return await this.mashProfileService.saveProfile({
      ...mashProfileInput,
      user: req.user,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<MashProfile | null> {
    return await this.mashProfileService.findByIdForUser(id, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteById(@Param('id') id: string) {
    return await this.mashProfileService.softDelete(id);
  }

  @Patch(':id/recovery')
  @UseGuards(JwtAuthGuard)
  async recoveryById(@Param('id') id: string) {
    return await this.mashProfileService.recovery(id);
  }
}
