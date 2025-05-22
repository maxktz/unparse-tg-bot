import type { Context } from '../../common/context';

export function unhandledMessages(ctx: Context) {
  return ctx.reply('Unhandled message');
}

export function unhandledCallbackQueries(ctx: Context) {
  return ctx.answerCallbackQuery();
}
