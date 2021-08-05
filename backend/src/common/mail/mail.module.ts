import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import * as path from 'path';

@Module({
  imports: [
    MailerModule.forRoot({
      // transport: `smtps://${process.env.MAIL_USER}:${process.env.MAIL_PASSWORD}@${process.env.MAIL_SMTP}`,
      // or
      transport: {
        host: process.env.MAIL_SMTP,
        secure: false,
        // port: 2525,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
      template: {
        dir: path.resolve(__dirname, '../../../', 'common/assets/templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
