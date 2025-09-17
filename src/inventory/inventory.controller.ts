import { Controller } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // TODO: Implementar endpoints de inventário
  // - GET /inventory (listar inventário do usuário)
  // - POST /inventory (adicionar item ao inventário)
  // - PATCH /inventory/:id (atualizar item)
  // - DELETE /inventory/:id (remover item)
  // - GET /inventory/expiring (itens próximos ao vencimento)
}
