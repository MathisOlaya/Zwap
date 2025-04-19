import { IsEmail, IsString, MinLength } from 'class-validator';

export class SanitizedUserDto {
  @IsEmail()
  email: string;
}
