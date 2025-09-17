import { Controller } from '@nestjs/common';
import { CommunityService } from './community.service';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  // TODO: Implementar endpoints de comunidade
  // - GET /community/posts (listar posts)
  // - POST /community/posts (criar post)
  // - GET /community/posts/:id (detalhes do post)
  // - PATCH /community/posts/:id (atualizar post)
  // - DELETE /community/posts/:id (excluir post)
  // - GET /community/posts/category/:category (posts por categoria)
}
