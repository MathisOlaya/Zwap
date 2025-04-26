import { Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class ArticleCreationDto {
  @IsString({ message: "Le nom de l'article n'est pas valide" })
  @MinLength(3, {
    message: 'Le nom de votre article doit contenir au minimum 3 caractères',
  })
  @IsNotEmpty({ message: "Merci de fournir un nom à l'article" })
  name: string;

  @IsString({ message: "La description de l'article n'est pas valide" })
  @IsNotEmpty({ message: "Merci de fournir une description à l'article" })
  description: string;

  @IsNumber({}, { message: "Le prix entré n'est pas un nombre valide" })
  @Max(10000, {
    message: "Le prix de votre article ne peut pas dépasser 10'000.-",
  })
  @Min(0, {
    message: 'Le prix de votre article ne peut pas être inférieur à 0.-',
  })
  @IsNotEmpty({ message: "Merci de fournir un prix à l'article" })
  @Type(() => Number)
  price: number;
}
