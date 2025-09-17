import { Controller } from '@nestjs/common';
import { BatchesService } from './batches.service';

@Controller('batches')
export class BatchesController {
  constructor(private readonly batchesService: BatchesService) {}

  // TODO: Implementar endpoints de batches
  // - GET /batches (listar batches do usuário)
  // - POST /batches (criar novo batch)
  // - GET /batches/:id (detalhes do batch)
  // - PATCH /batches/:id (atualizar batch)
  // - DELETE /batches/:id (excluir batch)
}
