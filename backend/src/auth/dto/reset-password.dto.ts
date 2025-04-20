import { IsStrongPassword, IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsStrongPassword(
    {
      minLength: 8,
      minUppercase: 1,
      minNumbers: 0,
      minLowercase: 0,
      minSymbols: 1,
    },
    { message: 'Le mot de passe ne respècte pas les critères.' },
  )
  @IsNotEmpty({ message: "Merci d'entrer un  mot de passe" })
  password: string;
}
