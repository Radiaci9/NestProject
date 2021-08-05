import { Module } from '@nestjs/common';
import { ServerRedis } from '@nestjs/microservices';
import { RedisController } from './redis.controller';
import { RedisService } from './redis.service';

@Module({
  controllers: [RedisController],
  providers: [RedisService, ServerRedis],
})
export class RedisModule {}
