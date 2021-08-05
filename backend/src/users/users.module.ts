import { Module } from '@nestjs/common';
import { ServerRedis } from '@nestjs/microservices';
import { RedisService } from 'src/common/redis/redis.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, RedisService, ServerRedis],
})
export class UsersModule {}
