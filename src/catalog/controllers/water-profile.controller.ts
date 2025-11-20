import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WaterProfileService } from '../services/water-profile.service';
import { WaterProfileInput } from '../inputs/water-profile.input';
import { WaterProfileQueryInput } from '../queries/water-profile.query';
import { User } from 'src/users/entities/user.entity';

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('water-profiles')
export class WaterProfileController {
  constructor(private readonly waterProfileService: WaterProfileService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query() query: WaterProfileQueryInput,
    @Request() req: AuthenticatedRequest,
  ) {
    if (query.page && query.take) {
      return await this.waterProfileService.findAllPaginated(query, req.user);
    }
    return await this.waterProfileService.findAll(req.user);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async save(
    @Body() waterProfileInput: WaterProfileInput,
    @Request() req: AuthenticatedRequest,
  ) {
    return await this.waterProfileService.save({
      ...waterProfileInput,
      user: req.user,
    });
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
