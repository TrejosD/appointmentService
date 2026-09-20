import { Reflector } from '@nestjs/core';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from 'src/auth/entities/user.entity';
import { META_ROLES } from '../../decorators/role-protected/role-protected.decorator';

@Injectable()
export class UserRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // el reflector es necesario para obtener la metaData. Enviada en la peticion. Para leerla por asi decirlo.
    // de esta metadata, obtenemos la lista de strings
    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );
    if (!validRoles) return true;
    if (validRoles.length === 0) return true;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const req = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user = req.user as User;
    if (!user) throw new BadRequestException('User not found');
    for (const role of user.roles) {
      if (validRoles.includes(role)) {
        return true;
      }
    }
    throw new ForbiddenException('User role invalid');
  }
}
