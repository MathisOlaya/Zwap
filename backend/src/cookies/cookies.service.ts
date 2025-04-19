import { Injectable } from '@nestjs/common';

// Express
import { Response } from 'express';

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
}
