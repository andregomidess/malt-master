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
} from '@nestjs/common';
import {
  EquipmentService,
  PaginatedResult,
} from '../services/equipment.service';
import { type EquipmentInputUnion } from '../inputs/equipment.input';
import { EquipmentQueryInput } from '../inputs/equipment-query.input';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Equipment } from '../entities/equipment.entity';

@Controller('equipments')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query() query: EquipmentQueryInput,
  ): Promise<PaginatedResult<Equipment>> {
    return await this.equipmentService.findAll(query);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async saveEquipment(@Body() equipmentInput: EquipmentInputUnion) {
    return await this.equipmentService.save(equipmentInput);
  }

  @Get('kettles')
  @UseGuards(JwtAuthGuard)
  async findKettles(
    @Query() query: EquipmentQueryInput,
  ): Promise<PaginatedResult<Equipment>> {
    return await this.equipmentService.findKettles(query);
  }

  @Get('fermenters')
  @UseGuards(JwtAuthGuard)
  async findFermenters(
    @Query() query: EquipmentQueryInput,
  ): Promise<PaginatedResult<Equipment>> {
    return await this.equipmentService.findFermenters(query);
  }

  @Get('chillers')
  @UseGuards(JwtAuthGuard)
  async findChillers(
    @Query() query: EquipmentQueryInput,
  ): Promise<PaginatedResult<Equipment>> {
    return await this.equipmentService.findChillers(query);
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
