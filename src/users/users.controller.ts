import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // TODO: Implementar endpoints de usuários
  // - GET /users/profile (perfil do usuário logado)
  // - PATCH /users/profile (atualizar perfil)
  // - GET /users/:id (buscar usuário por ID)
}
