import {
  Body,
  Controller,
  Post,
  Res,
  Req,
  HttpCode,
  Get,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

// DTOs
import { LoginUserDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';
import { SanitizedUserJwtDto } from './dto/sanitized-user-jwt.dto';
import { ResetPasswordDto } from './dto/password-reseting.dto';

// Services
import { AuthService } from './auth.service';
import { CookiesService } from 'src/cookies/cookies.service';
import { MailService } from 'src/mail/mail.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly cookiesService: CookiesService,
    private readonly mailService: MailService,
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() userEntry: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Valide user CREDS
    const user: SanitizedUserJwtDto =
      await this.authService.validateUser(userEntry);

    // Generating a JWT Token
    const token = await this.jwtService.sign(user);

    // Save it into a secured cookie
    this.cookiesService.store(res, 'access_token', token);
  }

  @Post('register')
  async register(
    @Body() userEntry: RegisterUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Register user
    const user: SanitizedUserJwtDto =
      await this.authService.registerUser(userEntry);

    // Generate JWT Token and store it into cookies
    const token = await this.jwtService.sign({
      id: user.id,
      email: user.email,
    });
    this.cookiesService.store(res, 'access_token', token);
  }

  @Get('reset-password')
  async requestPasswordReseting(@Body() infos: ResetPasswordDto) {
    await this.mailService.sendResetPassword(infos.email);
  }
}
