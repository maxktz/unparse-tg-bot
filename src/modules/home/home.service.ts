import type { Context } from '../../common/context';

export async function startCommand(ctx: Context) {
  return sendHome(ctx);
}

export function sendHome(ctx: Context) {
  return ctx.replyUni(
    `
Send me a text with entities to get HTML
`,
  );
}
