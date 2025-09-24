import {
  Body,
  Controller,
  Put,
  Get,
  Param,
  Delete,
  Post,
  UseGuards,
} from '@nestjs/common';
import { EquipmentService } from '../services/equipment.service';
import { type EquipmentInputUnion } from '../inputs/equipment.input';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('equipments')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return await this.equipmentService.findAll();
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async saveEquipment(@Body() equipmentInput: EquipmentInputUnion) {
    return await this.equipmentService.save(equipmentInput);
  }

  @Get('kettles')
  @UseGuards(JwtAuthGuard)
  async findKettles() {
    return await this.equipmentService.findKettles();
  }

  @Get('fermenters')
  @UseGuards(JwtAuthGuard)
  async findFermenters() {
    return await this.equipmentService.findFermenters();
  }

  @Get('chillers')
  @UseGuards(JwtAuthGuard)
  async findChillers() {
    return await this.equipmentService.findChillers();
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

  @Post(':id/recovery')
  @UseGuards(JwtAuthGuard)
  async recoveryEquipment(@Param('id') id: string) {
    return await this.equipmentService.recovery(id);
  }
}
