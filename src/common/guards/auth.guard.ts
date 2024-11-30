import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../../modules/auth/auth.service';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) throw new ForbiddenException();

    try {
      const payload = await this.authService.virifyToken(token);

      const { id } = payload;
      request.user = {
        ...(await this.userService.getById(id)),
      };
    } catch (error) {
      throw new ForbiddenException();
    }

    return true;
  }

  private extractToken(request: Request): string | null {
    const auth = request.headers['authorization'];
    if (!auth || !auth.startsWith('Bearer ')) return null;

    return (auth ?? '').split(' ')[1];
  }
}
