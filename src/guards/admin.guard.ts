import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

// returns in boolean(truthy and falsy returned values are also returned as boolean)
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.currentUser) {
      return false;
    }

    return request.currentUser.admin;
  }
}
