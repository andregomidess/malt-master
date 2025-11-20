import {
  Body,
  Controller,
  Put,
  Get,
  Param,
  Delete,
  UseGuards,
  Patch,
  Query,
  Request,
} from '@nestjs/common';
import {
  EquipmentService,
  PaginatedResult,
} from '../services/equipment.service';
import { type EquipmentInputUnion } from '../inputs/equipment.input';
import { EquipmentQueryInput } from '../inputs/equipment-query.input';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Equipment } from '../entities/equipment.entity';
import { User } from 'src/users/entities/user.entity';

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('equipments')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query() query: EquipmentQueryInput,
    @Request() req: AuthenticatedRequest,
  ): Promise<PaginatedResult<Equipment>> {
    return await this.equipmentService.findAll(query, req.user);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async saveEquipment(
    @Body() equipmentInput: EquipmentInputUnion,
    @Request() req: AuthenticatedRequest,
  ) {
    return await this.equipmentService.save({
      ...equipmentInput,
      user: req.user,
    });
  }

  @Get('kettles')
  @UseGuards(JwtAuthGuard)
  async findKettles(
    @Query() query: EquipmentQueryInput,
    @Request() req: AuthenticatedRequest,
  ): Promise<PaginatedResult<Equipment>> {
    return await this.equipmentService.findKettles(query, req.user);
  }

  @Get('fermenters')
  @UseGuards(JwtAuthGuard)
  async findFermenters(
    @Query() query: EquipmentQueryInput,
    @Request() req: AuthenticatedRequest,
  ): Promise<PaginatedResult<Equipment>> {
    return await this.equipmentService.findFermenters(query, req.user);
  }

  @Get('chillers')
  @UseGuards(JwtAuthGuard)
  async findChillers(
    @Query() query: EquipmentQueryInput,
    @Request() req: AuthenticatedRequest,
  ): Promise<PaginatedResult<Equipment>> {
    return await this.equipmentService.findChillers(query, req.user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string) {
    return await this.equipmentService.findById(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteById(@Param('id') id: string) {
    return await this.equipmentService.softDelete(id);
  }

  @Patch(':id/recovery')
  @UseGuards(JwtAuthGuard)
  async recoveryEquipment(@Param('id') id: string) {
    return await this.equipmentService.recovery(id);
  }
}
