import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

// DTOs
import { ZohoTokenDto } from './dto/zoho-token.dto';

// Dependencies
import * as crypto from 'crypto';

// Services
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class MailService {
  constructor(
    private readonly httpService: HttpService,
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // Variables
  private readonly baseApi = 'https://www.zohoapis.eu';

  // Tokens
  private accessToken: string;

  // Accounts
  private readonly noReplyAccount: string = '6448163000000002002';

  async getAccessToken() {
    const token = await this.prisma.token.findFirst({
      where: { type: 'Zoho' },
    });

    return token?.key;
  }
  async refreshToken() {
    console.log(await this.isTokenExpired());
    if (await this.isTokenExpired()) {
      try {
        // Getting query from ENV file
        const url = `https://accounts.zoho.eu/oauth/v2/token?refresh_token=${process.env.ZOHO_REFRESH_TOKEN}&client_id=${process.env.ZOHO_CLIENT_ID}&client_secret=${process.env.ZOHO_CLIENT_SECRET}&grant_type=refresh_token`;
        // Fetching API for new access_token
        const response = await firstValueFrom(this.httpService.post(url));
        console.log(response);

        // Getting new access token
        const newAccessToken = response.data.access_token;
        this.accessToken = newAccessToken;

        // Updating expiration in database
        const newExpiresIn = Date.now() + response.data.expires_in * 1000;
        await this.prisma.token.update({
          where: { type: 'Zoho' },
          data: {
            key: newAccessToken,
            expiresIn: newExpiresIn,
          },
        });
      } catch (err) {
        throw new Error('Failed to refresh token');
      }
    }
  }
  async isTokenExpired() {
    const token = await this.prisma.token.findFirst({
      where: {
        type: 'Zoho',
      },
    });

    if (!token) {
      throw new Error('Impossible de récupérer le token');
    }

    return Date.now() > token.expiresIn;
  }

  async sendResetPassword(email: string) {
    // Does the email exists ?
    if (!(await this.authService.emailExists(email))) {
      throw new HttpException(
        "Aucun compte n'existe avec cet adresse mail",
        HttpStatus.NOT_FOUND,
      );
    }
    // payload
    const payload = {
      email,
    };

    // Generate Key
    const key = await this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    // Refreshing Token
    await this.refreshToken();

    // Sending mail
    const htmlContent = `<html><h1>Réintialisation du mot de passe</h1><a href="http://localhost:3000/api/v1/auth/reset?key=${key}">Cliquer ici !</a></html>`;
    const url = `https://mail.zoho.eu/api/accounts/${this.noReplyAccount}/messages`;
    const requestBody = {
      fromAddress: 'no-reply@zwap.ch',
      toAddress: email,
      subject: 'Zwap | Réinitialisation de mot de passe',
      content: htmlContent,
    };
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Zoho-oauthtoken ${await this.getAccessToken()}`,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, requestBody, { headers }),
      );

      return response.data;
    } catch (err) {
      console.error('Erreur Zoho Mail:', err.response?.data || err.message);
      throw new HttpException(
        "Erreur lors de l'envoi de l'email",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
