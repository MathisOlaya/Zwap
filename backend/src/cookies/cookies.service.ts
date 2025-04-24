import { Injectable } from '@nestjs/common';

// Express
import { Request, Response } from 'express';

// Error
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class CookiesService {
  store(res: Response, name: string, data: any) {
    res.cookie(name, data, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // ← true si HTTPS
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });
  }
  clear(req: Request, res: Response, name: string) {
    if (!req.cookies[name]) {
      throw new HttpException(
        'Impossible de trouver le jeton spécifié.',
        HttpStatus.NOT_FOUND,
      );
    }
    res.clearCookie(name);
    res.end();
  }
}
