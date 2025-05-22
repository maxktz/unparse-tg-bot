import type { Context } from '../../common/context';
import { unparse } from '../../utils';

export async function unparseHandler(ctx: Context) {
  const text = ctx.message?.text ?? ctx.message?.caption;
  const entities = ctx.message?.entities ?? ctx.message?.caption_entities;

  const unparsed = unparse(text!, entities ?? []);
  // @ts-expect-error lib issue
  return ctx.reply(unparsed, { parse_mode: null });
}
