import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {
    console.log('🚀 ~ AuthGuard ~ jwtService:', jwtService);
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    console.log('🚀 ~ AuthGuard ~ token:', token);

    if (!token || !token.startsWith('Bearer ')) {
      return false;
    }

    try {
      const decoded = this.jwtService.verify(token.split(' ')[1]);
      request.user = decoded;
      return true;
    } catch (error) {
      return false;
    }
  }
}
