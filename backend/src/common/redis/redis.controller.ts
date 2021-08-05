import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Public } from '../decorators/public-route.decorator';
import { KeyValuePairDto } from './dto/key-value-pair.dto';
import { KeyValuesPairDto } from './dto/key-values-pair.dto';
import { RedisService } from './redis.service';
import {
  DELETE_KEY,
  GET_VALUES_KEY,
  GET_VALUE_KEY,
  PUSH_VALUES_KEY,
  SET_VALUE_KEY,
} from '../constants';

@Controller()
export class RedisController {
  constructor(private redisService: RedisService) {}

  @Public()
  @MessagePattern(GET_VALUE_KEY)
  async getValue(@Payload() key: string): Promise<string | null> {
    return await this.redisService.getValue(key);
  }

  @Public()
  @MessagePattern(SET_VALUE_KEY)
  async setValue(@Payload() { key, value }: KeyValuePairDto): Promise<void> {
    await this.redisService.setValue(key, value);
  }

  @Public()
  @MessagePattern(GET_VALUES_KEY)
  async getValues(@Payload() key: string): Promise<string[] | null> {
    return await this.redisService.getValues(key);
  }

  @Public()
  @MessagePattern(PUSH_VALUES_KEY)
  async pushValues(
    @Payload() { key, values }: KeyValuesPairDto,
  ): Promise<void> {
    await this.redisService.pushValues(key, values);
  }

  @Public()
  @MessagePattern(DELETE_KEY)
  async delKey(@Payload() key: string): Promise<void> {
    await this.redisService.delKey(key);
  }
}
