import { IsEmail, IsNumber, IsString, MinLength } from 'class-validator';

//Type of Token
import { TokenType } from '@prisma/client';

export class ZohoTokenDto {
  id: number;
  type: TokenType;
  key: string;
  expiresIn: bigint;
}
