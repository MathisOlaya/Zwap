import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsEmail(
    {},
    {
      message: "L'email fourni n'est pas valide",
    },
  )
  @IsString({ message: "L'email fourni n'est pas valide" })
  @IsNotEmpty({ message: 'Merci de renseigner une adresse email' })
  email: string;

  @IsNotEmpty({ message: "Merci d'entrer un  mot de passe" })
  password: string;
}
