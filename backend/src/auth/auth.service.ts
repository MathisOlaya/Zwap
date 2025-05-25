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
import { Response } from 'express';
import Stripe from 'stripe';

// Models
import { User } from '@prisma/client';
import { SanitizedUserJwtDto } from './dto/sanitized-user-jwt.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { StripeService } from 'src/stripe/stripe.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
    private readonly stripe: StripeService,
  ) {}

  // Validate User Creds
  async validateUser(userInput: LoginUserDto) {
    const { email, password } = userInput;

    try {
      const user = await this.prisma.user.findFirst({
        where: { email: email.toLowerCase() },
      });

      // None
      if (!user) {
        throw new BadRequestException('Identifiants incorrectes');
      }

      // Compare password
      if (!(await bcrypt.compare(password, user.password))) {
        throw new BadRequestException('Identifiants incorrectes');
      }

      return this.sanitizeUserJwt(user);
    } catch {
      throw new HttpException(
        'Une erreur du serveur est intervenue.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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

    try {
      // Hash password using Bcrypt
      const password: string = await bcrypt.hash(userInput.password, 10);

      // Lower case email only
      userInput.email = userInput.email.toLowerCase();

      // Store user into DB
      const user: User = await this.prisma.user.create({
        data: { ...userInput, password: password },
      });

      // Create stripe account user
      const customer: Stripe.Customer = await this.stripe.createUser(user);

      // Store stripe id to user database
      await this.prisma.user.update({
        where: { id: user.id },
        data: { stripe_customerId: customer.id },
      });

      return this.sanitizeUserJwt(user);
    } catch {
      throw new HttpException(
        'Une erreur du serveur est intervenue.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updatePassword(email: string, password: string) {
    try {
      const hashedPassowrd = await bcrypt.hash(password, 10);
      const user = await this.prisma.user.update({
        where: { email },
        data: { password: hashedPassowrd },
      });
    } catch (err) {
      throw new HttpException(
        'Erreur lors de la modification du mot de passe',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUser(id: string) {
    try {
      // Deleting all articles images from CLOUDINARY
      await this.cloudinary.destroyAllImagesFromFolder(`articles/${id}`);

      // Deleting stripe account
      const user = await this.prisma.user.findFirstOrThrow({
        where: { id },
        select: { stripe_customerId: true },
      });

      if (!user.stripe_customerId) {
        throw new HttpException(
          'Erreur lors de la suppresion du compte',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      await this.stripe.deleteUser(user.stripe_customerId);

      // Delete user
      await this.prisma.user.delete({ where: { id } });
    } catch (err) {
      throw new HttpException(
        "Erreur lors de la suppresion de l'utilisateur",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  catchJwtError(
    err: Error,
    customExpirationMessage?: string,
    customErrorMessage?: string,
  ) {
    if (err.name === 'TokenExpiredError') {
      throw new HttpException(
        customExpirationMessage || "Le jeton d'accès a expiré",
        HttpStatus.NOT_FOUND,
      );
    }
    if (err.name === 'JsonWebTokenError') {
      throw new HttpException(
        customErrorMessage || "Le jeton d'accès n'est pas valide",
        HttpStatus.UNAUTHORIZED,
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
