import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { type UserInput } from './inputs/user.input';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put()
  upsertUser(@Body() userInput: UserInput) {
    return this.usersService.updateUser(userInput);
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @Delete(':id')
  deleteUserById(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Post(':id/recovery')
  restoreUser(@Param('id') id: string) {
    return this.usersService.recoveryUser(id);
  }
}
