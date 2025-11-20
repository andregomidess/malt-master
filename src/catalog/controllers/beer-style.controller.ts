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
import { BeerStyleService } from '../services/beer-style.service';
import { BeerStyleInput } from '../inputs/beer-style.input';
import { BeerStyleQueryInput } from '../queries/beer-style.query';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('beer-styles')
export class BeerStyleController {
  constructor(private readonly beerStyleService: BeerStyleService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query() query: BeerStyleQueryInput,
    @Request() req: AuthenticatedRequest,
  ) {
    if (query.page && query.take) {
      return await this.beerStyleService.findAllPaginated(query, req.user);
    }
    return await this.beerStyleService.findAll(req.user);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async saveBeerStyle(
    @Body() beerStyleInput: BeerStyleInput,
    @Request() req: AuthenticatedRequest,
  ) {
    return await this.beerStyleService.save({
      ...beerStyleInput,
      user: req.user,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string) {
    return await this.beerStyleService.findById(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteById(@Param('id') id: string) {
    return await this.beerStyleService.softDelete(id);
  }

  @Patch(':id/recovery')
  @UseGuards(JwtAuthGuard)
  async recoveryBeerStyle(@Param('id') id: string) {
    return await this.beerStyleService.recovery(id);
  }
}
