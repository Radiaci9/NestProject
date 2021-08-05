import { ClientsModule, ServerRedis, Transport } from '@nestjs/microservices';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

import { PrismaModule } from './common/prisma/prisma.module';
import { ComposeGuard } from './common/guards/compose-auth.guard';

import { JwtExpAuthGuard } from './common/guards/jwt-exp-auth.guard';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

import { JWTStrategy } from './common/strategies/jwt.stategy';

import { RedisModule } from './common/redis/redis.module';
import { RedisService } from './common/redis/redis.service';

import { REDIS_SERVICE } from './common/constants';
import { RolesGuard } from './common/guards/roles.guard';
import { ValidationPipe } from './common/pipes/validation.pipe';
// import { ServeStaticModule } from '@nestjs/serve-static';
import { MailModule } from './common/mail/mail.module';
import { ProfileModule } from './profile/profile.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    RedisModule,
    PrismaModule,
    AuthModule,
    MailModule,
    UsersModule,
    ProfileModule,
    PostsModule,
    CommentsModule,
    // ServeStaticModule.forRoot({
    //   rootPath: path.resolve(__dirname, 'assets'),
    // }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_TOKEN_EXPIRATION_TIME || '1h',
      },
    }),
    ClientsModule.register([
      {
        name: REDIS_SERVICE,
        transport: Transport.REDIS,
        options: {
          url: process.env.REDIS_URL,
        },
      },
    ]),
  ],
  providers: [
    JwtAuthGuard,
    JwtExpAuthGuard,
    RolesGuard,
    JWTStrategy,
    ServerRedis,
    RedisService,
    {
      provide: APP_GUARD,
      useClass: ComposeGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
  exports: [],
})
export class AppModule {}
