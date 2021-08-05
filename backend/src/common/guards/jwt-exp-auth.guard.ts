import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { INVALID_TOKENS_KEY } from '../constants';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class JwtExpAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private redisClient: RedisService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization.split(' ')[1];

    const invalidTokens: string[] = await this.redisClient.getValues(
      INVALID_TOKENS_KEY,
    );

    if (invalidTokens.includes(token)) throw new UnauthorizedException();

    const user = this.jwtService.verify(token);
    request.user = user;

    return true;
  }
}
