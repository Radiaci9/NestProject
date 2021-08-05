import { Module } from '@nestjs/common';
import { ServerRedis } from '@nestjs/microservices';
import { RedisService } from 'src/common/redis/redis.service';
import { UsersService } from 'src/users/users.service';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService, UsersService, RedisService, ServerRedis],
})
export class PostsModule {}
