import { IsEmail, IsNumber, IsString, MinLength } from 'class-validator';

export class SanitizedUserDto {
  @IsNumber()
  id: Number;

  @IsString()
  firstname: string;
}
