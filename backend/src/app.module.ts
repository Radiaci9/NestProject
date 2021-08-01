import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    UsersModule,

    ClientsModule.register([
      {
        name: process.env.REDIS_NAME,
        transport: Transport.REDIS,
        options: {
          url: process.env.REDISURL,
        },
      },
    ]),
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
