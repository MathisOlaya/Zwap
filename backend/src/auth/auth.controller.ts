import { Body, Controller, Post, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

// DTOs
import { LoginUserDto } from './dto/login.dto';

// Services
import { AuthService } from './auth.service';
import { CookiesService } from 'src/cookies/cookies.service';
import { SanitizedUserDto } from './dto/sanitized-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly cookiesService: CookiesService,
  ) {}

  @Post('login')
  async login(
    @Body() userEntry: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Valide user CREDS
    const user: SanitizedUserDto =
      await this.authService.validateUser(userEntry);

    // Generating a JWT Token
    const token = await this.jwtService.signAsync(user);

    // Save it into a secured cookie
    this.cookiesService.store(res, 'access_token', token);
  }
}
