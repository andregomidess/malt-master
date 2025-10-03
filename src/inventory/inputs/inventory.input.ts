import { IsOptional, IsUUID } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { IsEntity } from 'src/database/common/decorators/transform-if-entity-exists.decorator';

export class InventoryInput {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsEntity({ entity: User })
  user!: User;
}
