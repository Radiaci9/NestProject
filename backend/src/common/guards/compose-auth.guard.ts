import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_PATH_KEY } from '../constants';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtExpAuthGuard } from './jwt-exp-auth.guard';
import { RolesGuard } from './roles.guard';

@Injectable()
export class ComposeGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authGuard: JwtAuthGuard,
    private expAuthGuard: JwtExpAuthGuard,
    private rolesGuard: RolesGuard,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = await this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_PATH_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) return true;

    return (
      (await this.authGuard.canActivate(context)) &&
      (await this.expAuthGuard.canActivate(context)) &&
      (await this.rolesGuard.canActivate(context))
    );
  }
}
