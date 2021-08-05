import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserDto } from 'src/users/dto/user.dto';
import { IS_NEED_ACTIVATION, ROLES_KEY } from '../constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const requiredRoles = await this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const isNeedActivation = await this.reflector.getAllAndOverride<boolean>(
      IS_NEED_ACTIVATION,
      [context.getHandler(), context.getClass()],
    );

    const user: UserDto = context.switchToHttp().getRequest().user;

    if (isNeedActivation && !user.isActivated)
      throw new ForbiddenException('User must be activated');

    if (!requiredRoles) return true;

    return requiredRoles.includes(user.role);
  }
}
