import { IsEmail, IsNumber, IsString, IsUUID } from 'class-validator';

export class SanitizedUserDto {
  @IsUUID()
  id: string;

  @IsString()
  firstname: string;
}
