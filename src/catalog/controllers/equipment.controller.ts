import {
  Body,
  Controller,
  Put,
  Get,
  Param,
  Delete,
  Post,
} from '@nestjs/common';
import { EquipmentService } from '../services/equipment.service';
import { type EquipmentInputUnion } from '../inputs/equipment.input';

@Controller('equipments')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Get()
  async findAll() {
    return await this.equipmentService.findAll();
  }

  @Put()
  async saveEquipment(@Body() equipmentInput: EquipmentInputUnion) {
    return await this.equipmentService.save(equipmentInput);
  }

  @Get('kettles')
  async findKettles() {
    return await this.equipmentService.findKettles();
  }

  @Get('fermenters')
  async findFermenters() {
    return await this.equipmentService.findFermenters();
  }

  @Get('chillers')
  async findChillers() {
    return await this.equipmentService.findChillers();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.equipmentService.findById(id);
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    return await this.equipmentService.softDelete(id);
  }

  @Post(':id/recovery')
  async recoveryEquipment(@Param('id') id: string) {
    return await this.equipmentService.recovery(id);
  }
}
