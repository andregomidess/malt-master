import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailer: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendVerificationEmail(
    to: string,
    username: string,
    token: string,
  ): Promise<void> {
    const appUrl = this.configService.get<string>('APP_URL');
    const verifyUrl = `${appUrl}/auth/verify?token=${encodeURIComponent(token)}`;

    await this.mailer.sendMail({
      to,
      subject: 'Confirme seu e-mail',
      template: 'verify',
      context: { username, verifyUrl },
    });
  }

  async sendForgotPasswordEmail(
    to: string,
    username: string,
    token: string,
  ): Promise<void> {
    const appUrl = this.configService.get<string>('APP_URL');
    const forgotPasswordUrl = `${appUrl}/auth/forgot-password?token=${encodeURIComponent(token)}`;
    await this.mailer.sendMail({
      to,
      subject: 'Recuperação de senha',
      template: 'forgot-password',
      context: { username, forgotPasswordUrl },
    });
  }
}
