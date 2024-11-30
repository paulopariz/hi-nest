import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';

export const UserAuth = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const { user } = context.switchToHttp().getRequest();

    if (!user) throw new NotFoundException('User not found.');
    return user;
  },
);
