import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class NotificationService {
  private readonly apiUrl = 'https://api.pushover.net/1/messages.json';
  private readonly userKey: string;
  private readonly apiToken: string;
  constructor(private configService: ConfigService) {
    this.userKey = this.configService.get<string>('PUSHOVER_USER_KEY');
    this.apiToken = this.configService.get<string>('PUSHOVER_API_TOKEN');
  }

  async sendNotification(title: string, message: string): Promise<any> {
    const payload = {
      token: this.apiToken,
      user: this.userKey,
      title,
      message,
      priority: 0,
    };

    try {
      const response = await axios.post(this.apiUrl, payload, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to send notification: ${error.message}`);
    }
  }
}
