import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

// DTOs
import { LoginUserDto } from './dto/login.dto';
import { ResetPasswordMailDto } from './dto/password-reseting-request.dto';
import { RegisterUserDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SanitizedUserJwtDto } from './dto/sanitized-user-jwt.dto';

// Services
import { CookiesService } from 'src/cookies/cookies.service';
import { MailService } from 'src/mail/mail.service';
import { AuthService } from './auth.service';
import { User } from './decorators/user.decorator';
import { JwtAuthGuard } from './jwt-auth/jwt-auth.guard';

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

    return { user };
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
  @UseGuards(JwtAuthGuard)
  async delete(
    @Req() req: Request,
    @Res() res: Response,
    @User('id') id: string,
  ) {
    try {
      // Delete user
      await this.authService.deleteUser(id);

      // Remove cookie
      await this.cookiesService.clear(req, res, 'access_token');
    } catch (err) {
      this.authService.catchJwtError(err);

      // Error
      throw new HttpException(
        "Erreur lors de la suppression de l'utilisateur",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
