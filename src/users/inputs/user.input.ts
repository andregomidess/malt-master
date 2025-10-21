import { UserRole, UserStatus, UserGender } from '../entities/user.entity';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserInput {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  username!: string;

  @IsOptional()
  @IsString()
  pictureUrl?: string | null;

  @IsString()
  country!: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsString()
  @IsEnum(UserGender)
  gender!: UserGender;

  @IsString()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsOptional()
  @IsString()
  emailVerificationToken?: string | null;

  @IsOptional()
  @IsString()
  emailVerifiedAt?: Date | null;

  @IsOptional()
  @IsString()
  refreshToken?: string | null;
}
