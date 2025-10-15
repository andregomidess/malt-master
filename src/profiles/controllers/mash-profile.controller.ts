import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MashProfileService } from '../services/mash-profile.service';
import { MashProfileInput } from '../inputs/mash-profile.input';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('mash-profiles')
export class MashProfileController {
  constructor(private readonly mashProfileService: MashProfileService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return await this.mashProfileService.findAll();
  }

  @Get('public')
  @UseGuards(JwtAuthGuard)
  async findPublic() {
    return await this.mashProfileService.findPublic();
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async save(@Body() mashProfileInput: MashProfileInput) {
    return await this.mashProfileService.saveProfile(mashProfileInput);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string) {
    return await this.mashProfileService.findById(id);
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
