import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @IsString({ message: 'Le prénom doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Merci de renseigner un prénom' })
  firstname: string;

  @IsPhoneNumber('CH', { message: "Le numéro de téléphone n'est pas valide." })
  @IsNotEmpty({ message: 'Merci de renseigner un numéro de téléphone' })
  phoneNumber: string;

  @IsEmail(
    {},
    {
      message: "L'email fourni n'est pas valide",
    },
  )
  @IsString({ message: "L'email fourni n'est pas valide" })
  @IsNotEmpty({ message: 'Merci de renseigner une adresse email' })
  email: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minUppercase: 1,
      minNumbers: 0,
      minLowercase: 0,
      minSymbols: 0,
    },
    { message: 'Le mot de passe ne respècte pas les critères.' },
  )
  @IsNotEmpty({ message: "Merci d'entrer un  mot de passe" })
  password: string;
}
