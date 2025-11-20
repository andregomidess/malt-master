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
import { FermentableService } from '../services/fermentable.service';
import { FermentableInput } from '../inputs/fermentable.input';
import { FermentableQueryInput } from '../queries/fermentable.query';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('fermentables')
export class FermentableController {
  constructor(private readonly fermentableService: FermentableService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query() query: FermentableQueryInput,
    @Request() req: AuthenticatedRequest,
  ) {
    if (query.page && query.take) {
      return await this.fermentableService.findAllPaginated(query, req.user);
    }
    return await this.fermentableService.findAll(req.user);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async save(
    @Body() fermentableInput: FermentableInput,
    @Request() req: AuthenticatedRequest,
  ) {
    return await this.fermentableService.save({
      ...fermentableInput,
      user: req.user,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string) {
    return await this.fermentableService.findById(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteById(@Param('id') id: string) {
    return await this.fermentableService.softDelete(id);
  }

  @Patch(':id/recovery')
  @UseGuards(JwtAuthGuard)
  async recoveryById(@Param('id') id: string) {
    return await this.fermentableService.recovery(id);
  }
}
