import { Controller, Post, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(private readonly jwtService: JwtService) {}

  @Post('login')
  async login(@Res({ passthrough: true }) res: Response) {
    // VALIDATION USER IN SERVICE

    // WARNING : Generate JWT Token in SERVICE
    const token = this.jwtService.sign({});

    // Save it into a secured cookie
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // ← true si HTTPS
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });
  }
}
