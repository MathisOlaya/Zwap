import {
  Body,
  Controller,
  Post,
  Res,
  Req,
  HttpCode,
  Get,
  Param,
  HttpException,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

// DTOs
import { LoginUserDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';
import { SanitizedUserJwtDto } from './dto/sanitized-user-jwt.dto';
import { ResetPasswordMailDto } from './dto/password-reseting-request.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

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

  @Get('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.cookiesService.clear(req, res, 'access_token');
  }

  @Delete('delete')
  @HttpCode(204)
  async delete(@Req() req: Request) {
    try {
      const jwt = await this.jwtService.verify(req.cookies.access_token);

      // Delete user
      await this.authService.deleteUser(jwt.email);
    } catch (err) {
      this.authService.catchJwtError(err);
    }
  }

  @Get('reset-password')
  async requestPasswordReseting(@Body() infos: ResetPasswordMailDto) {
    await this.mailService.sendResetPassword(infos.email);
  }

  @Post('reset-password/:key')
  async resetPassword(
    @Param('key') key: string,
    @Body() creds: ResetPasswordDto,
  ) {
    if (key === ':key') {
      throw new HttpException(
        'Clé de réinitialisation manquante',
        HttpStatus.BAD_REQUEST,
      );
    }
    // Checking token validity
    try {
      const payload = await this.jwtService.verify(key);

      await this.authService.updatePassword(payload.email, creds.password);
    } catch (err) {
      this.authService.catchJwtError(
        err,
        'Le lien de réinitialisation a expiré.',
        "Le lien de réinitialisation n'est pas valide",
      );
      throw new HttpException(
        'Erreur lors de la modification du mot de passe',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
