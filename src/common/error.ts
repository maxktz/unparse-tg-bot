import type { ErrorHandler } from 'grammy';
import type { Context } from '../common/context';

export const errorHandler: ErrorHandler<Context> = (error) => {
  const { ctx } = error;

  ctx.logger.error({
    err: error.error,
  });
};
