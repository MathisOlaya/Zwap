import {
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

// Models
import { PrismaService } from 'src/prisma/prisma.service';

// DTOs
import { LoginUserDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';

// Dependencies
import * as bcrypt from 'bcrypt';

// Models
import { User } from '@prisma/client';
import { SanitizedUserJwtDto } from './dto/sanitized-user-jwt.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  // Validate User Creds
  async validateUser(userInput: LoginUserDto) {
    const { email, password } = userInput;

    const user = await this.prisma.user.findFirst({ where: { email } });

    // None
    if (!user) {
      throw new BadRequestException('Identifiants incorrectes');
    }

    // Compare password
    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Identifiants incorrectes');
    }

    return this.sanitizeUserJwt(user);
  }
  async registerUser(userInput: RegisterUserDto) {
    // Are email & PhoneNumber available
    if (!(await this.isEmailUnique(userInput.email))) {
      throw new HttpException(
        'Cet email est déjà utilisé.',
        HttpStatus.CONFLICT,
      );
    }

    if (!(await this.isPhoneNumberUnique(userInput.phoneNumber))) {
      throw new HttpException(
        'Ce numéro de téléphone est déjà utilisé.',
        HttpStatus.CONFLICT,
      );
    }

    // Hash password using Bcrypt
    const password: string = await bcrypt.hash(userInput.password, 10);

    // Store user into DB
    const user: User = await this.prisma.user.create({
      data: { ...userInput, password: password },
    });

    return this.sanitizeUserJwt(user);
  }
  async updatePassword(email: string, password: string) {
    try {
      const hashedPassowrd = await bcrypt.hash(password, 10);
      const user = await this.prisma.user.update({
        where: { email },
        data: { password: hashedPassowrd },
      });

      console.log(user);
    } catch (err) {
      throw new HttpException(
        'Erreur lors de la modification du mot de passe',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  sanitizeUser(user: User) {
    // Remove password from USER
    const { password, ...sanitizedUser } = user;

    return sanitizedUser;
  }
  sanitizeUserJwt(user: User) {
    const sanitizedUser: SanitizedUserJwtDto = {
      id: user.id,
      email: user.email,
    };

    return sanitizedUser;
  }
  async isEmailUnique(email: string) {
    if (
      await this.prisma.user.findFirst({
        where: {
          email,
        },
      })
    ) {
      return false;
    }
    return true;
  }
  async isPhoneNumberUnique(phone: string) {
    if (
      await this.prisma.user.findFirst({
        where: {
          phoneNumber: phone,
        },
      })
    ) {
      return false;
    }
    return true;
  }
  async emailExists(email: string): Promise<boolean> {
    try {
      const user = await this.prisma.user.findFirst({
        where: { email },
      });
      return user ? true : false;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
      throw new HttpException(
        "Impossible de récupérer l'utilisateur",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
