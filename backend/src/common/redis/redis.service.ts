import { Injectable } from '@nestjs/common';
import { ServerRedis } from '@nestjs/microservices';
import { RedisClient } from '@nestjs/microservices/external/redis.interface';
import { promisify } from 'util';
import { DEFAULT_EXP_TIME } from '../constants';

@Injectable()
export class RedisService {
  client: RedisClient;
  constructor(private readonly server: ServerRedis) {
    this.client = this.server.createRedisClient();

    this.client.get = promisify(this.client.get).bind(this.client);
    this.client.set = promisify(this.client.set).bind(this.client);

    this.client.lpush = promisify(this.client.lpush).bind(this.client);
    this.client.lrange = promisify(this.client.lrange).bind(this.client);

    this.client.del = promisify(this.client.del).bind(this.client);
  }

  async getValue(key: string): Promise<any> {
    return await this.client.get(key);
  }

  async setValue(
    key: string,
    value: string | number,
    expTime = DEFAULT_EXP_TIME,
  ): Promise<void> {
    await this.client.set(key, value, 'Ex', expTime);
  }

  async getValues(key: string): Promise<any> {
    return await this.client.lrange([key, 0, -1]);
  }

  // i don't know how to set Exp time to list
  async pushValues(key: string, values: string[] | number[]): Promise<void> {
    await this.client.lpush([key, ...values]);
  }

  async delKey(key: string): Promise<void> {
    await this.client.del(key);
  }
}
