import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthLoginInput {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
