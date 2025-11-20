import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { renderFile } from 'pug';
import { join } from 'path';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const sgMail = require('@sendgrid/mail') as typeof import('@sendgrid/mail');

@Injectable()
export class MailService {
  private useSendGrid: boolean;
  private fromEmail: string;

  constructor(
    private readonly mailer: MailerService,
    private readonly configService: ConfigService,
  ) {
    const sendGridApiKey = this.configService.get<string>('SENDGRID_API_KEY');
    this.useSendGrid = !!sendGridApiKey;
    this.fromEmail = this.configService.get<string>('EMAIL_FROM') || '';

    if (this.useSendGrid && sendGridApiKey) {
      sgMail.setApiKey(sendGridApiKey);
    }
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

  private async sendWithSendGrid(
    to: string,
    subject: string,
    html: string,
  ): Promise<void> {
    const msg = {
      to,
      from: this.fromEmail,
      subject,
      html,
    };

    await sgMail.send(msg);
  }

  async sendVerificationEmail(
    to: string,
    username: string,
    token: string,
  ): Promise<void> {
    const frontendUrl = this.configService.get<string>('CLIENT_URL');
    const verifyUrl = `${frontendUrl}/verify-email?token=${encodeURIComponent(token)}`;

    const context = { username, verifyUrl };

    if (this.useSendGrid) {
      const html = this.renderTemplate('verify', context);
      await this.sendWithSendGrid(to, 'Confirme seu e-mail', html);
    } else {
      await this.mailer.sendMail({
        to,
        subject: 'Confirme seu e-mail',
        template: 'verify',
        context,
      });
    }
  }

  async sendForgotPasswordEmail(
    to: string,
    username: string,
    token: string,
  ): Promise<void> {
    const frontendUrl = this.configService.get<string>('CLIENT_URL');
    const forgotPasswordUrl = `${frontendUrl}/change-password?token=${encodeURIComponent(token)}`;

    const context = { username, forgotPasswordUrl };

    if (this.useSendGrid) {
      const html = this.renderTemplate('forgot-password', context);
      await this.sendWithSendGrid(to, 'Recuperação de senha', html);
    } else {
      await this.mailer.sendMail({
        to,
        subject: 'Recuperação de senha',
        template: 'forgot-password',
        context,
      });
    }
  }
}
