import { Injectable, BadRequestException } from '@nestjs/common';

// Models
import { PrismaService } from 'src/prisma/prisma.service';

// DTOs
import { LoginUserDto } from './dto/login.dto';

// Dependencies
import bcrypt from 'bcrypt';

// Models
import { User } from '@prisma/client';

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
    if (await !bcrypt.compare(password, user.password)) {
      throw new BadRequestException('Identifiants incorrectes');
    }

    return this.sanitizeUser(user);
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
}
