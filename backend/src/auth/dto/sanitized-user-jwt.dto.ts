import { IsEmail, IsNumber, IsString } from 'class-validator';

export class SanitizedUserJwtDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsEmail()
  email: string;
}
