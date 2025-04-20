import { IsEmail, IsString, MinLength } from 'class-validator';

export class ResetPasswordMailDto {
  @IsEmail({}, { message: 'Merci de renseigner un email valide' })
  email: string;
}
