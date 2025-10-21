import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailer: MailerService,
    private readonly cfg: ConfigService,
  ) {}

  async sendVerificationEmail(
    to: string,
    username: string,
    token: string,
  ): Promise<void> {
    const appUrl = this.cfg.get<string>('APP_URL') ?? 'http://localhost:3000';
    const verifyUrl = `${appUrl}/auth/verify?token=${encodeURIComponent(token)}`;

    await this.mailer.sendMail({
      to,
      subject: 'Confirme seu e-mail',
      template: 'verify',
      context: { username, verifyUrl },
    });
  }
}
