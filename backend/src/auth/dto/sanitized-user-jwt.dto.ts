import { IsEmail, IsNumber, IsString, IsUUID } from 'class-validator';

export class SanitizedUserJwtDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsEmail()
  email: string;
}
