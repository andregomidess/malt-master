import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { type UserInput } from './inputs/user.input';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from './entities/user.entity';

interface AuthenticatedRequest extends Request {
  user: User;
}

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put()
  upsertUser(@Body() userInput: UserInput) {
    return this.usersService.updateUser(userInput);
  }

  @Get('metrics')
  async getMetrics(@Request() req: AuthenticatedRequest) {
    return await this.usersService.getUserMetrics(req.user.id);
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
