import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { type UserInput } from './inputs/user.input';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put()
  @UseGuards(JwtAuthGuard)
  upsertUser(@Body() userInput: UserInput) {
    return this.usersService.updateUser(userInput);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getUserById(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getUsers() {
    return this.usersService.getUsers();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteUserById(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Post(':id/recovery')
  @UseGuards(JwtAuthGuard)
  restoreUser(@Param('id') id: string) {
    return this.usersService.recoveryUser(id);
  }
}
