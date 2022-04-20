import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthInfo } from '../types/AuthInfo';

export const Auth = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthInfo => {
    const request = ctx.switchToHttp().getRequest();
    const token = request.headers['authorization'] || '';
    const apikey = request.headers['apikey'] || '';

    return { token, apikey };
  },
);
