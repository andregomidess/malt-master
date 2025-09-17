import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // TODO: Implementar endpoints de autenticação
  // - POST /auth/login
  // - POST /auth/register
  // - POST /auth/refresh
  // - POST /auth/logout
}
