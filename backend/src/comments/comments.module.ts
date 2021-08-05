import { Module } from '@nestjs/common';
import { ServerRedis } from '@nestjs/microservices';
import { RedisService } from 'src/common/redis/redis.service';
import { PostsService } from 'src/posts/posts.service';
import { UsersService } from 'src/users/users.service';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  controllers: [CommentsController],
  providers: [
    CommentsService,
    UsersService,
    PostsService,
    RedisService,
    ServerRedis,
  ],
})
export class CommentsModule {}
