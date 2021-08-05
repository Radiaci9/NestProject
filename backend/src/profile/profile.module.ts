import { Module } from '@nestjs/common';
import { ServerRedis } from '@nestjs/microservices';
import { RedisService } from 'src/common/redis/redis.service';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

@Module({
  controllers: [ProfileController, ProfilesController],
  providers: [ProfileService, ProfilesService, RedisService, ServerRedis],
})
export class ProfileModule {}
