/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  // el context, lo usamos para obtener el request.
  const req = ctx.switchToHttp().getRequest();
  //   del request obtenemos el user.
  const user: User = req.user;
  // si no encontramos el user, mostramos el error, si esta lo retornamos
  if (!user) throw new InternalServerErrorException('User not found (request)');
  if (data == null) {
    return user;
  }
  if (data == 'email') {
    return user.email;
  }
});
