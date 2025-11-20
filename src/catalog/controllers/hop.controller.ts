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
import { HopService } from '../services/hop.service';
import { HopInput } from '../inputs/hop.input';
import { HopQueryInput } from '../queries/hop.query';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('hops')
@UseGuards(JwtAuthGuard)
export class HopController {
  constructor(private readonly hopService: HopService) {}

  @Get()
  async findAll(
    @Query() query: HopQueryInput,
    @Request() req: AuthenticatedRequest,
  ) {
    if (query.page && query.take) {
      return await this.hopService.findAllPaginated(query, req.user);
    }
    return await this.hopService.findAll(req.user);
  }

  @Put()
  async saveHop(
    @Body() hopInput: HopInput,
    @Request() req: AuthenticatedRequest,
  ) {
    return await this.hopService.save({
      ...hopInput,
      user: req.user,
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.hopService.findById(id);
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    return await this.hopService.softDelete(id);
  }

  @Patch(':id/recovery')
  async recoveryById(@Param('id') id: string) {
    return await this.hopService.recovery(id);
  }
}
