import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
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
import { YeastInput } from '../inputs/yeast.input';
import { YeastQueryInput } from '../queries/yeast.query';
import { YeastService } from '../services/yeast.service';
import { User } from 'src/users/entities/user.entity';

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('yeasts')
export class YeastController {
  constructor(private readonly yeastService: YeastService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query() query: YeastQueryInput,
    @Request() req: AuthenticatedRequest,
  ) {
    if (query.page && query.take) {
      return await this.yeastService.findAllPaginated(query, req.user);
    }
    return await this.yeastService.findAll(req.user);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async save(
    @Body() yeastInput: YeastInput,
    @Request() req: AuthenticatedRequest,
  ) {
    return await this.yeastService.save({
      ...yeastInput,
      user: req.user,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string) {
    return await this.yeastService.findById(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteById(@Param('id') id: string) {
    return await this.yeastService.softDelete(id);
  }

  @Patch(':id/recovery')
  @UseGuards(JwtAuthGuard)
  async recoveryById(@Param('id') id: string) {
    return await this.yeastService.recovery(id);
  }
}
