import { createParamDecorator, ExecutionContext } from '@nestjs/common';
type RequestWithUser = {
  user?: unknown;
};
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): unknown => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();

    if (request && 'user' in request) {
      return request.user;
    }

    return undefined;
  },
);
