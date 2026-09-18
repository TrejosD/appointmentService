/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RawHeaders = createParamDecorator((ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const raw: string[] = req.rawHeaders;
  console.log(raw);
  return raw;
});
