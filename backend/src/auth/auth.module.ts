import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, ServerRedis, Transport } from '@nestjs/microservices';
import { REDIS_SERVICE } from 'src/common/constants';
// import { MailModule } from 'src/common/mail/mail.module';
import { MailService } from 'src/common/mail/mail.service';
import { RedisService } from 'src/common/redis/redis.service';
import { UsersService } from 'src/users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_TOKEN_EXPIRATION_TIME || '1h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    MailService,
    RedisService,
    ServerRedis,
  ],
})
export class AuthModule {}
