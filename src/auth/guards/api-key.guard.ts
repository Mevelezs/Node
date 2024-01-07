import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ConfigType } from '@nestjs/config';

import config from '../../../enviroments/typesEnviroments';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {} // inyeccion del lector de metadata

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler()); // captura y lectura de la metadata

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const authHeder = request.header('Auth');
    const isAuth = authHeder === this.configService.apiKey;

    if (!isAuth) throw new UnauthorizedException('Que no careverga');
    return isAuth;
  }
}
