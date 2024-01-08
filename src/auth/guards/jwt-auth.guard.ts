import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private refelctor: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.refelctor.get(IS_PUBLIC_KEY, context.getHandler());
    if (isPublic) return true; // si es publico lo deja pasar
    return super.canActivate(context); // hace lo que por defecto (pide token valido para pasar)
  }
}
