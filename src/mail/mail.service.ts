import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { renderFile } from 'pug';
import { join } from 'path';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;
  private fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.resend = new Resend(apiKey);
    this.fromEmail = this.configService.get<string>('EMAIL_FROM') || '';
  }

  private renderTemplate(
    templateName: string,
    context: Record<string, any>,
  ): string {
    const templatePath = join(
      __dirname,
      '..',
      '..',
      'templates',
      `${templateName}.pug`,
    );

    return renderFile(templatePath, context);
  }

  private async sendEmail(
    to: string,
    subject: string,
    html: string,
  ): Promise<void> {
    await this.resend.emails.send({
      from: this.fromEmail,
      to,
      subject,
      html,
    });
  }

  async sendVerificationEmail(
    to: string,
    username: string,
    token: string,
  ): Promise<void> {
    const frontendUrl = this.configService.get<string>('CLIENT_URL');
    const verifyUrl = `${frontendUrl}/verify-email?token=${encodeURIComponent(token)}`;

    const html = this.renderTemplate('verify', {
      username,
      verifyUrl,
    });

    await this.sendEmail(to, 'Confirme seu e-mail', html);
  }

  async sendForgotPasswordEmail(
    to: string,
    username: string,
    token: string,
  ): Promise<void> {
    const frontendUrl = this.configService.get<string>('CLIENT_URL');
    const forgotPasswordUrl = `${frontendUrl}/change-password?token=${encodeURIComponent(token)}`;

    const html = this.renderTemplate('forgot-password', {
      username,
      forgotPasswordUrl,
    });

    await this.sendEmail(to, 'Recuperação de senha', html);
  }
}
