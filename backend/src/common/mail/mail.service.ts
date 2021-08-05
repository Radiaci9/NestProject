import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/users/dto/user.dto';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  ///maybe we neew to await this request in services
  // but i think sometime create email procees can take more time that we want
  // and because of this i don't wait this result from functions in anothers services
  async sendUserActivationMail(user: UserDto) {
    try {
      const link = `${process.env.SERVER_URL}/activate/${user.activationLink}`;
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Welcome to App! Activate your Email',
        template: './activation',
        context: {
          name: user.email,
          link,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  async sendUserNewPasswordMail(user: UserDto, newPassword: string) {
    try {
      const link = `${process.env.SERVER_URL}/resetPasswordAfterClick`;
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Reset password',
        template: './resetPassword',
        context: {
          name: user.email,
          link,
          newPassword,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }
}
