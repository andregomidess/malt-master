import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserInput } from 'src/users/inputs/user.input';
import { AuthLoginInput } from './inputs/AuthLoginInput';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() userInput: UserInput) {
    return this.authService.registerUser(userInput);
  }

  @Post('login')
  login(@Body() userInput: AuthLoginInput) {
    return this.authService.login(userInput);
  }

  @Post('forgot-password')
  forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password')
  resetPassword(@Body() body: { token: string; newPassword: string }) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }

  @Get('verify/:token')
  verifyEmail(@Param('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('refresh')
  refreshToken(@Body() body: { refreshToken: string; userId: string }) {
    return this.authService.refreshAccessToken(body.refreshToken, body.userId);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Request() req: AuthenticatedRequest) {
    return this.authService.logout(req.user.id);
  }
}
