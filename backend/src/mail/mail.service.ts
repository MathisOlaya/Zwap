import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MailService {
  constructor(private readonly httpService: HttpService) {}

  // Variables
  private readonly baseApi = 'https://www.zohoapis.eu';

  // Tokens
  private accessToken: string;
  private tokenReceivedAt: number;

  async refreshToken() {
    try {
      // Getting query from ENV file
      const query = `/oauth/v2/token?refresh_token=${process.env.ZOHO_REFRESH_TOKEN}&client_id=${process.env.ZOHO_CLIENT_ID}&client_secret=${process.env.ZOHO_CLIENT_SECRET}&grant_type=refresh_token`;

      // Fetching API for new access_token
      const response = await firstValueFrom(
        this.httpService.post(this.baseApi + query),
      );

      // Getting new access token
      this.accessToken = response.data.access_token;

      this.tokenReceivedAt = Date.now();
    } catch {
      throw new Error('Failed to refresh token');
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
}
