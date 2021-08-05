import { Module } from '@nestjs/common';
import { ServerRedis } from '@nestjs/microservices';
import { RedisService } from './redis.service';

@Module({
  providers: [RedisService, ServerRedis],
})
export class RedisModule {}
